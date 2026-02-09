/**
 * Logger Service Tests
 * Tests for centralized logging service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Logger, LogLevel, logger } from './logger';

describe('Logger', () => {
  let consoleDebugSpy: any;
  let consoleInfoSpy: any;
  let consoleWarnSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Log Level Filtering', () => {
    it('should log DEBUG messages when log level is DEBUG', () => {
      const testLogger = new Logger();
      testLogger.setLogLevel(LogLevel.DEBUG);
      
      testLogger.debug('Test debug message');
      
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should not log DEBUG messages when log level is INFO', () => {
      const testLogger = new Logger();
      testLogger.setLogLevel(LogLevel.INFO);
      
      testLogger.debug('Test debug message');
      
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should log INFO messages when log level is INFO', () => {
      const testLogger = new Logger();
      testLogger.setLogLevel(LogLevel.INFO);
      
      testLogger.info('Test info message');
      
      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should log WARN messages when log level is WARN', () => {
      const testLogger = new Logger();
      testLogger.setLogLevel(LogLevel.WARN);
      
      testLogger.warn('Test warn message');
      
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should log ERROR messages at any log level', () => {
      const testLogger = new Logger();
      testLogger.setLogLevel(LogLevel.ERROR);
      
      testLogger.error('Test error message');
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('Message Formatting', () => {
    it('should include timestamp in log message', () => {
      const testLogger = new Logger();
      testLogger.setLogLevel(LogLevel.DEBUG);
      
      testLogger.debug('Test message');
      
      const call = consoleDebugSpy.mock.calls[0][0];
      expect(call).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
    });

    it('should include log level in message', () => {
      const testLogger = new Logger();
      testLogger.setLogLevel(LogLevel.INFO);
      
      testLogger.info('Test message');
      
      const call = consoleInfoSpy.mock.calls[0][0];
      expect(call).toContain('[INFO]');
    });

    it('should include context in message when provided', () => {
      const testLogger = new Logger();
      testLogger.setLogLevel(LogLevel.INFO);
      
      testLogger.info('Test message', { component: 'TestComponent' });
      
      const call = consoleInfoSpy.mock.calls[0][0];
      expect(call).toContain('TestComponent');
    });

    it('should include message text', () => {
      const testLogger = new Logger();
      testLogger.setLogLevel(LogLevel.INFO);
      
      testLogger.info('Test message');
      
      const call = consoleInfoSpy.mock.calls[0][0];
      expect(call).toContain('Test message');
    });
  });

  describe('Context Support', () => {
    it('should log with component context', () => {
      const testLogger = new Logger();
      testLogger.setLogLevel(LogLevel.INFO);
      
      testLogger.info('Test', { component: 'TestComp', action: 'testAction' });
      
      const call = consoleInfoSpy.mock.calls[0][0];
      expect(call).toContain('TestComp');
      expect(call).toContain('testAction');
    });

    it('should log with custom context fields', () => {
      const testLogger = new Logger();
      testLogger.setLogLevel(LogLevel.INFO);
      
      testLogger.info('Test', { userId: '123', requestId: 'abc' });
      
      const call = consoleInfoSpy.mock.calls[0][0];
      expect(call).toContain('userId');
      expect(call).toContain('123');
    });
  });

  describe('Error Object Serialization', () => {
    it('should handle error objects in error log', () => {
      const testLogger = new Logger();
      testLogger.setLogLevel(LogLevel.ERROR);
      const error = new Error('Test error');
      
      testLogger.error('Error occurred', {}, error);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0];
      expect(call[0]).toContain('Error occurred');
      expect(call[1]).toBe(error);
    });

    it('should handle error objects in warn log', () => {
      const testLogger = new Logger();
      testLogger.setLogLevel(LogLevel.WARN);
      const error = new Error('Test warning');
      
      testLogger.warn('Warning occurred', {}, error);
      
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe('Dynamic Configuration', () => {
    it('should allow changing log level dynamically', () => {
      const testLogger = new Logger();
      testLogger.setLogLevel(LogLevel.ERROR);
      
      testLogger.debug('Should not log');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      
      testLogger.setLogLevel(LogLevel.DEBUG);
      testLogger.debug('Should log');
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should allow enabling/disabling remote logging', () => {
      const testLogger = new Logger();
      
      testLogger.setRemoteLogging(true);
      testLogger.setRemoteLogging(false);
      
      // No errors should occur
      expect(true).toBe(true);
    });
  });

  describe('Singleton Instance', () => {
    it('should export a singleton logger instance', () => {
      expect(logger).toBeDefined();
      expect(logger.debug).toBeDefined();
      expect(logger.info).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.error).toBeDefined();
    });
  });
});
