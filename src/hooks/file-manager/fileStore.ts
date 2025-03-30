
import { ManagedFile } from './types';

// Global state for files shared across components
let globalFiles: ManagedFile[] = [];
let listeners: (() => void)[] = [];

/**
 * Notifies all listeners of state changes
 */
export const notifyListeners = (): void => {
  listeners.forEach(listener => listener());
};

/**
 * Registers a listener for state changes
 */
export const registerListener = (listener: () => void): (() => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

/**
 * Gets all files from global state
 */
export const getFiles = (): ManagedFile[] => {
  return [...globalFiles];
};

/**
 * Updates the global file state
 */
export const setFiles = (files: ManagedFile[]): void => {
  globalFiles = [...files];
  notifyListeners();
};

/**
 * Adds a file to global state
 */
export const addFile = (file: ManagedFile): void => {
  globalFiles = [...globalFiles, file];
  notifyListeners();
};

/**
 * Removes a file from global state
 */
export const removeFile = (fileId: string): void => {
  globalFiles = globalFiles.filter(file => file.id !== fileId);
  notifyListeners();
};
