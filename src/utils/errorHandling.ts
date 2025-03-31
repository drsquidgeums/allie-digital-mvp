
import { toast } from "sonner";

type ErrorOptions = {
  title?: string;
  fallbackMessage?: string;
  showToast?: boolean;
  logToConsole?: boolean;
};

/**
 * Centralized error handling utility that provides consistent error handling
 * across the application with logging and user notifications
 */
export const handleError = (
  error: unknown, 
  options: ErrorOptions = {}
) => {
  const { 
    title = "Error", 
    fallbackMessage = "Something went wrong", 
    showToast = true,
    logToConsole = true
  } = options;

  // Extract error message based on error type
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string'
      ? error
      : fallbackMessage;
  
  // Log error to console if enabled
  if (logToConsole) {
    console.error(`${title}:`, error);
  }
  
  // Show toast notification if enabled
  if (showToast) {
    toast.error(title, {
      description: errorMessage
    });
  }
  
  // Return the error message for potential use in UI
  return errorMessage;
};

/**
 * Wraps an async function with consistent error handling
 */
export const withErrorHandling = <T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  options: ErrorOptions = {}
) => {
  return async (...args: Args): Promise<T | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, options);
      return undefined;
    }
  };
};
