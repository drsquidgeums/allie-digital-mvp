
/**
 * Production-safe logger utility.
 * In production, only warnings and errors are output.
 * In development, all levels are enabled.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  /** Debug-level logging — stripped in production */
  debug: (...args: unknown[]) => {
    if (isDev) console.log('[DEBUG]', ...args);
  },

  /** Informational logging — stripped in production */
  info: (...args: unknown[]) => {
    if (isDev) console.log('[INFO]', ...args);
  },

  /** Warnings — always output */
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },

  /** Errors — always output */
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};
