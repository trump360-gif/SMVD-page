/**
 * Structured Logger
 *
 * Lightweight structured logger that outputs JSON in production
 * and pretty-printed messages in development.
 * No external dependencies - works with Next.js Edge Runtime.
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info({ context: 'POST /api/work' }, 'Project created');
 *   logger.error({ err: error, context: 'upload' }, 'File upload failed');
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMeta {
  /** Error object (will be serialized) */
  err?: unknown;
  /** API route or module context */
  context?: string;
  /** Additional structured data */
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const MIN_LEVEL = LOG_LEVELS[
  (process.env.LOG_LEVEL as LogLevel) || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')
];

function serializeError(err: unknown): Record<string, unknown> {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    };
  }
  return { value: String(err) };
}

function formatLog(level: LogLevel, meta: LogMeta, message: string): string {
  const timestamp = new Date().toISOString();
  const entry: Record<string, unknown> = {
    timestamp,
    level,
    msg: message,
  };

  // Copy meta fields (except err which needs special handling)
  for (const [key, value] of Object.entries(meta)) {
    if (key === 'err') {
      entry.error = serializeError(value);
    } else {
      entry[key] = value;
    }
  }

  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify(entry);
  }

  // Pretty format for development
  const levelColors: Record<LogLevel, string> = {
    debug: '\x1b[90m', // gray
    info: '\x1b[36m',  // cyan
    warn: '\x1b[33m',  // yellow
    error: '\x1b[31m', // red
  };
  const reset = '\x1b[0m';
  const color = levelColors[level];

  let output = `${color}[${level.toUpperCase()}]${reset} ${message}`;
  if (meta.context) {
    output = `${color}[${level.toUpperCase()}]${reset} [${meta.context}] ${message}`;
  }
  if (meta.err) {
    const errInfo = serializeError(meta.err);
    output += ` | ${errInfo.name}: ${errInfo.message}`;
    if (errInfo.stack) {
      output += `\n${errInfo.stack}`;
    }
  }

  return output;
}

function createLogMethod(level: LogLevel) {
  return (metaOrMessage: LogMeta | string, message?: string) => {
    if (LOG_LEVELS[level] < MIN_LEVEL) return;

    let meta: LogMeta;
    let msg: string;

    if (typeof metaOrMessage === 'string') {
      meta = {};
      msg = metaOrMessage;
    } else {
      meta = metaOrMessage;
      msg = message ?? '';
    }

    const formatted = formatLog(level, meta, msg);

    switch (level) {
      case 'debug':
      case 'info':
        console.log(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        break;
    }
  };
}

export const logger = {
  debug: createLogMethod('debug'),
  info: createLogMethod('info'),
  warn: createLogMethod('warn'),
  error: createLogMethod('error'),
};
