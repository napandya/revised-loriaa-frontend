/**
 * Error Handling Utilities
 * Provides error classification, message generation, and retry logic
 */

import { AxiosError } from 'axios';
import { logger } from './logger';

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  TIMEOUT = 'TIMEOUT',
  NOT_FOUND = 'NOT_FOUND',
  UNKNOWN = 'UNKNOWN',
}

export interface ClassifiedError {
  type: ErrorType;
  message: string;
  userMessage: string;
  statusCode?: number;
  retryable: boolean;
  originalError: any;
}

/**
 * Classify an error into specific error types
 */
export function classifyError(error: any): ClassifiedError {
  // Axios error
  if (error.isAxiosError || error.response) {
    const axiosError = error as AxiosError;
    
    // Network errors (no response from server)
    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
        return {
          type: ErrorType.TIMEOUT,
          message: 'Request timed out',
          userMessage: 'The request took too long. Please try again.',
          retryable: true,
          originalError: error,
        };
      }
      
      return {
        type: ErrorType.NETWORK,
        message: 'Network error: Unable to connect to server',
        userMessage: 'Unable to connect. Please check your internet connection.',
        retryable: true,
        originalError: error,
      };
    }
    
    const statusCode = axiosError.response.status;
    
    // Authentication errors
    if (statusCode === 401) {
      return {
        type: ErrorType.AUTH,
        message: 'Unauthorized',
        userMessage: 'Your session has expired. Please log in again.',
        statusCode,
        retryable: false,
        originalError: error,
      };
    }
    
    // Authorization errors
    if (statusCode === 403) {
      return {
        type: ErrorType.AUTH,
        message: 'Forbidden',
        userMessage: 'You do not have permission to perform this action.',
        statusCode,
        retryable: false,
        originalError: error,
      };
    }
    
    // Not found errors
    if (statusCode === 404) {
      return {
        type: ErrorType.NOT_FOUND,
        message: 'Resource not found',
        userMessage: 'The requested resource was not found.',
        statusCode,
        retryable: false,
        originalError: error,
      };
    }
    
    // Validation errors
    if (statusCode === 400 || statusCode === 422) {
      const detail = (axiosError.response.data as any)?.detail || 'Validation error';
      return {
        type: ErrorType.VALIDATION,
        message: detail,
        userMessage: detail,
        statusCode,
        retryable: false,
        originalError: error,
      };
    }
    
    // Server errors
    if (statusCode >= 500) {
      return {
        type: ErrorType.SERVER,
        message: 'Server error',
        userMessage: 'Something went wrong on our end. Please try again later.',
        statusCode,
        retryable: true,
        originalError: error,
      };
    }
  }
  
  // Generic error
  return {
    type: ErrorType.UNKNOWN,
    message: error.message || 'An unknown error occurred',
    userMessage: 'Something went wrong. Please try again.',
    retryable: false,
    originalError: error,
  };
}

/**
 * Generate a user-friendly error message
 */
export function getUserFriendlyMessage(error: any): string {
  const classified = classifyError(error);
  return classified.userMessage;
}

/**
 * Extract error context for logging
 */
export function extractErrorContext(error: any): Record<string, any> {
  const context: Record<string, any> = {};
  
  if (error.isAxiosError || error.response) {
    const axiosError = error as AxiosError;
    context.url = axiosError.config?.url;
    context.method = axiosError.config?.method;
    context.statusCode = axiosError.response?.status;
    context.statusText = axiosError.response?.statusText;
    context.responseData = axiosError.response?.data;
  }
  
  context.message = error.message;
  context.stack = error.stack;
  
  return context;
}

/**
 * Retry logic helper for transient failures
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    backoff?: boolean;
    retryableErrors?: ErrorType[];
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoff = true,
    retryableErrors = [ErrorType.NETWORK, ErrorType.TIMEOUT, ErrorType.SERVER],
  } = options;
  
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const classified = classifyError(error);
      
      // Don't retry if error is not retryable
      if (!retryableErrors.includes(classified.type)) {
        throw error;
      }
      
      // Don't delay on last attempt
      if (attempt < maxRetries - 1) {
        const delay = backoff ? delayMs * Math.pow(2, attempt) : delayMs;
        logger.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`, {
          action: 'retryOperation',
          attempt: attempt + 1,
          maxRetries,
          delay,
        });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Handle error and log it appropriately
 */
export function handleError(
  error: any,
  context: {
    component?: string;
    action?: string;
    [key: string]: any;
  }
): ClassifiedError {
  const classified = classifyError(error);
  const errorContext = extractErrorContext(error);
  
  logger.error(classified.message, {
    ...context,
    errorType: classified.type,
    ...errorContext,
  }, error);
  
  return classified;
}
