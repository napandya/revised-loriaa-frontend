/**
 * Axios Instance Configuration
 * Configured axios instance with interceptors for authentication and error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api';
import { logger } from './logger';
import { classifyError, extractErrorContext } from './errorHandler';

// Generate a unique correlation ID for request tracing
function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject JWT token, add correlation ID, and log requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Generate and attach correlation ID for request tracing
    const correlationId = generateCorrelationId();
    config.headers['X-Correlation-ID'] = correlationId;
    
    // Inject JWT token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request
    logger.debug('API Request', {
      component: 'axios',
      action: 'request',
      correlationId,
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
    });
    
    return config;
  },
  (error: AxiosError) => {
    logger.error('Request interceptor error', {
      component: 'axios',
      action: 'requestError',
    }, error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response
    const correlationId = response.config.headers['X-Correlation-ID'];
    logger.debug('API Response', {
      component: 'axios',
      action: 'response',
      correlationId,
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
    });
    
    return response;
  },
  (error: AxiosError) => {
    const correlationId = error.config?.headers?.['X-Correlation-ID'] as string;
    const classified = classifyError(error);
    const errorContext = extractErrorContext(error);
    
    // Log the error with full context
    logger.error('API Error', {
      component: 'axios',
      action: 'responseError',
      correlationId,
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      errorType: classified.type,
      statusCode: classified.statusCode,
      retryable: classified.retryable,
      ...errorContext,
    }, error);
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      logger.warn('Unauthorized access, redirecting to login', {
        component: 'axios',
        action: 'unauthorized',
        correlationId,
      });
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      logger.warn('Forbidden access', {
        component: 'axios',
        action: 'forbidden',
        correlationId,
      });
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      logger.warn('Resource not found', {
        component: 'axios',
        action: 'notFound',
        correlationId,
      });
    }
    
    // Handle 500+ Server Errors
    if (error.response?.status && error.response.status >= 500) {
      logger.error('Server error', {
        component: 'axios',
        action: 'serverError',
        correlationId,
        statusCode: error.response.status,
      });
    }
    
    // Handle network errors
    if (!error.response) {
      logger.error('Network error', {
        component: 'axios',
        action: 'networkError',
        correlationId,
        message: error.message,
      }, error);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
