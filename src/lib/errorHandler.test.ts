/**
 * Error Handler Tests
 * Tests for error classification, message generation, and retry logic
 */

import { describe, it, expect, vi } from 'vitest';
import {
  classifyError,
  getUserFriendlyMessage,
  extractErrorContext,
  retryOperation,
  handleError,
  ErrorType,
} from './errorHandler';
import { AxiosError } from 'axios';

describe('errorHandler', () => {
  describe('classifyError', () => {
    it('should classify timeout errors', () => {
      const error = {
        isAxiosError: true,
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
      } as any;

      const classified = classifyError(error);

      expect(classified.type).toBe(ErrorType.TIMEOUT);
      expect(classified.retryable).toBe(true);
      expect(classified.userMessage).toContain('too long');
    });

    it('should classify network errors', () => {
      const error = {
        isAxiosError: true,
        message: 'Network Error',
      } as any;

      const classified = classifyError(error);

      expect(classified.type).toBe(ErrorType.NETWORK);
      expect(classified.retryable).toBe(true);
      expect(classified.userMessage).toContain('connect');
    });

    it('should classify 401 authentication errors', () => {
      const error = {
        isAxiosError: true,
        response: { status: 401 },
      } as any;

      const classified = classifyError(error);

      expect(classified.type).toBe(ErrorType.AUTH);
      expect(classified.statusCode).toBe(401);
      expect(classified.retryable).toBe(false);
      expect(classified.userMessage).toContain('session');
    });

    it('should classify 403 authorization errors', () => {
      const error = {
        isAxiosError: true,
        response: { status: 403 },
      } as any;

      const classified = classifyError(error);

      expect(classified.type).toBe(ErrorType.AUTH);
      expect(classified.statusCode).toBe(403);
      expect(classified.retryable).toBe(false);
      expect(classified.userMessage).toContain('permission');
    });

    it('should classify 404 not found errors', () => {
      const error = {
        isAxiosError: true,
        response: { status: 404 },
      } as any;

      const classified = classifyError(error);

      expect(classified.type).toBe(ErrorType.NOT_FOUND);
      expect(classified.statusCode).toBe(404);
      expect(classified.retryable).toBe(false);
    });

    it('should classify 400 validation errors', () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { detail: 'Invalid input data' },
        },
      } as any;

      const classified = classifyError(error);

      expect(classified.type).toBe(ErrorType.VALIDATION);
      expect(classified.statusCode).toBe(400);
      expect(classified.retryable).toBe(false);
      expect(classified.userMessage).toBe('Invalid input data');
    });

    it('should classify 422 validation errors', () => {
      const error = {
        isAxiosError: true,
        response: { status: 422 },
      } as any;

      const classified = classifyError(error);

      expect(classified.type).toBe(ErrorType.VALIDATION);
      expect(classified.statusCode).toBe(422);
    });

    it('should classify 500+ server errors', () => {
      const error = {
        isAxiosError: true,
        response: { status: 500 },
      } as any;

      const classified = classifyError(error);

      expect(classified.type).toBe(ErrorType.SERVER);
      expect(classified.statusCode).toBe(500);
      expect(classified.retryable).toBe(true);
      expect(classified.userMessage).toContain('our end');
    });

    it('should classify unknown errors', () => {
      const error = new Error('Unknown error');

      const classified = classifyError(error);

      expect(classified.type).toBe(ErrorType.UNKNOWN);
      expect(classified.retryable).toBe(false);
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return user-friendly message for network error', () => {
      const error = {
        isAxiosError: true,
        message: 'Network Error',
      } as any;

      const message = getUserFriendlyMessage(error);

      expect(message).toContain('connect');
    });

    it('should return user-friendly message for auth error', () => {
      const error = {
        isAxiosError: true,
        response: { status: 401 },
      } as any;

      const message = getUserFriendlyMessage(error);

      expect(message).toContain('session');
    });
  });

  describe('extractErrorContext', () => {
    it('should extract context from axios error', () => {
      const error = {
        isAxiosError: true,
        config: {
          url: '/api/test',
          method: 'GET',
        },
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { error: 'Resource not found' },
        },
        message: 'Request failed',
        stack: 'Error stack',
      } as any;

      const context = extractErrorContext(error);

      expect(context.url).toBe('/api/test');
      expect(context.method).toBe('GET');
      expect(context.statusCode).toBe(404);
      expect(context.statusText).toBe('Not Found');
      expect(context.message).toBe('Request failed');
      expect(context.stack).toBeDefined();
    });

    it('should extract context from generic error', () => {
      const error = new Error('Generic error');

      const context = extractErrorContext(error);

      expect(context.message).toBe('Generic error');
      expect(context.stack).toBeDefined();
    });
  });

  describe('retryOperation', () => {
    it('should succeed on first attempt', async () => {
      const operation = vi.fn().mockResolvedValue('success');

      const result = await retryOperation(operation);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on network error', async () => {
      const error = {
        isAxiosError: true,
        message: 'Network Error',
      };
      const operation = vi
        .fn()
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValue('success');

      const result = await retryOperation(operation, {
        maxRetries: 3,
        delayMs: 10,
      });

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should not retry on non-retryable error', async () => {
      const error = {
        isAxiosError: true,
        response: { status: 401 },
      };
      const operation = vi.fn().mockRejectedValue(error);

      await expect(
        retryOperation(operation, { maxRetries: 3, delayMs: 10 })
      ).rejects.toEqual(error);

      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should throw after max retries', async () => {
      const error = {
        isAxiosError: true,
        message: 'Network Error',
      };
      const operation = vi.fn().mockRejectedValue(error);

      await expect(
        retryOperation(operation, { maxRetries: 3, delayMs: 10 })
      ).rejects.toEqual(error);

      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should use exponential backoff', async () => {
      const error = {
        isAxiosError: true,
        message: 'Network Error',
      };
      const operation = vi
        .fn()
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValue('success');

      const start = Date.now();
      await retryOperation(operation, {
        maxRetries: 3,
        delayMs: 10,
        backoff: true,
      });
      const duration = Date.now() - start;

      // Should take at least 10 + 20 = 30ms with backoff
      expect(duration).toBeGreaterThanOrEqual(25);
    });
  });

  describe('handleError', () => {
    it('should log and classify error', () => {
      const error = {
        isAxiosError: true,
        response: { status: 500 },
      };

      const classified = handleError(error, {
        component: 'TestComponent',
        action: 'testAction',
      });

      expect(classified.type).toBe(ErrorType.SERVER);
      expect(classified.statusCode).toBe(500);
    });
  });
});
