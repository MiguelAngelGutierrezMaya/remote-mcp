/**
 * LogLevel type for supported log levels.
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Logger class for backend service logging with context and structured data.
 */
export class Logger {
  constructor(private context: string) {}

  private format(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const base = `[${new Date().toISOString()}] [${level.toUpperCase()}] [${this.context}] ${message}`;
    if (meta) {
      return `${base} | ${JSON.stringify(meta)}`;
    }
    return base;
  }

  debug(message: string, meta?: Record<string, unknown>) {
    console.debug(this.format('debug', message, meta));
  }
  info(message: string, meta?: Record<string, unknown>) {
    console.info(this.format('info', message, meta));
  }
  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(this.format('warn', message, meta));
  }
  error(message: string, meta?: Record<string, unknown>) {
    console.error(this.format('error', message, meta));
  }
}

/**
 * Factory function to create a logger with a specific context.
 * @param context - The context or module name for the logger
 * @returns Logger instance
 */
export const getLogger = (context: string) => new Logger(context); 