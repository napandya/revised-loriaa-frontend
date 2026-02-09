/**
 * Centralized Logging Service
 * Provides structured logging with multiple log levels and context support
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
}

class Logger {
  private minLevel: LogLevel;
  private enableRemoteLogging: boolean;
  private isDevelopment: boolean;

  constructor() {
    // Environment-aware configuration
    this.isDevelopment = import.meta.env.MODE === 'development';
    
    // Get log level from environment or default to INFO in production, DEBUG in development
    const configuredLevel = import.meta.env.VITE_LOG_LEVEL?.toUpperCase() || 
      (this.isDevelopment ? 'DEBUG' : 'INFO');
    this.minLevel = LogLevel[configuredLevel as keyof typeof LogLevel] || LogLevel.INFO;
    
    // Remote logging (Sentry, DataDog, LogRocket) - disabled by default
    this.enableRemoteLogging = import.meta.env.VITE_ENABLE_REMOTE_LOGGING === 'true';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private formatMessage(entry: LogEntry): string {
    const { timestamp, level, message, context } = entry;
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}]${contextStr} ${message}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };
  }

  private writeLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    const formattedMessage = this.formatMessage(entry);

    // Console logging (development or when verbose logging is enabled)
    if (this.isDevelopment || entry.level === LogLevel.ERROR) {
      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage, entry.error || '');
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage, entry.error || '');
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage, entry.error || '');
          break;
      }
    }

    // Send to remote logging service (Sentry, DataDog, LogRocket)
    if (this.enableRemoteLogging && entry.level === LogLevel.ERROR) {
      this.sendToRemote(entry);
    }
  }

  private sendToRemote(entry: LogEntry): void {
    // Integration point for remote logging services
    // Example: Sentry.captureException(entry.error, { contexts: { custom: entry.context } });
    // Example: LogRocket.captureException(entry.error, { tags: entry.context });
    
    // Placeholder for remote logging integration
    if (import.meta.env.VITE_SENTRY_DSN) {
      // Sentry integration would go here
      // For now, just log that it would be sent
      console.debug('Would send to remote logging:', entry);
    }
  }

  /**
   * Log debug message (verbose, for development)
   */
  public debug(message: string, context?: LogContext): void {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.writeLog(entry);
  }

  /**
   * Log informational message
   */
  public info(message: string, context?: LogContext): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.writeLog(entry);
  }

  /**
   * Log warning message
   */
  public warn(message: string, context?: LogContext, error?: Error): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, context, error);
    this.writeLog(entry);
  }

  /**
   * Log error message
   */
  public error(message: string, context?: LogContext, error?: Error): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
    this.writeLog(entry);
  }

  /**
   * Set minimum log level dynamically
   */
  public setLogLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Enable or disable remote logging
   */
  public setRemoteLogging(enabled: boolean): void {
    this.enableRemoteLogging = enabled;
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for testing
export { Logger };
