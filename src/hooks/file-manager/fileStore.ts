import { ManagedFile } from './types';

// Global state for files shared across components
let globalFiles: ManagedFile[] = [];
let listeners: (() => void)[] = [];
let isNotifying = false; // Prevent cascading notifications

/**
 * Notifies all listeners of state changes
 */
export const notifyListeners = (): void => {
  if (isNotifying) return; // Prevent re-entrant calls
  
  isNotifying = true;
  try {
    listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in file store listener:', error);
      }
    });
  } catch (error) {
    console.error('Error notifying file store listeners:', error);
  } finally {
    isNotifying = false;
  }
};

/**
 * Registers a listener for state changes
 */
export const registerListener = (listener: () => void): (() => void) => {
  if (typeof listener !== 'function') {
    console.error('Invalid listener provided to registerListener');
    return () => {};
  }
  
  // Check if listener already exists to prevent duplicates
  if (listeners.includes(listener)) {
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }
  
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
  if (!Array.isArray(files)) {
    console.error('Invalid files array provided to setFiles');
    return;
  }
  
  // Only update if files actually changed
  if (JSON.stringify(globalFiles) !== JSON.stringify(files)) {
    globalFiles = [...files];
    notifyListeners();
  }
};

/**
 * Adds a file to global state
 */
export const addFile = (file: ManagedFile): void => {
  if (!file || !file.id) {
    console.error('Invalid file provided to addFile');
    return;
  }
  
  // Check if file already exists
  const existingFileIndex = globalFiles.findIndex(f => f.id === file.id);
  if (existingFileIndex !== -1) {
    console.log('File already exists, updating:', file.id);
    globalFiles[existingFileIndex] = file;
  } else {
    globalFiles = [...globalFiles, file];
  }
  notifyListeners();
};

/**
 * Updates an existing file in global state
 */
export const updateFile = (fileId: string, updatedFile: ManagedFile): void => {
  if (!fileId || !updatedFile) {
    console.error('Invalid parameters provided to updateFile');
    return;
  }
  
  const fileIndex = globalFiles.findIndex(file => file.id === fileId);
  if (fileIndex === -1) {
    console.warn('File not found for update, adding as new file:', fileId);
    addFile(updatedFile);
    return;
  }
  
  globalFiles = globalFiles.map(file => 
    file.id === fileId ? updatedFile : file
  );
  notifyListeners();
};

/**
 * Removes a file from global state
 */
export const removeFile = (fileId: string): void => {
  if (!fileId) {
    console.error('Invalid fileId provided to removeFile');
    return;
  }
  
  const initialLength = globalFiles.length;
  globalFiles = globalFiles.filter(file => file.id !== fileId);
  
  if (globalFiles.length === initialLength) {
    console.warn('File not found for removal:', fileId);
  }
  
  notifyListeners();
};

/**
 * Clears all files from global state
 */
export const clearFiles = (): void => {
  globalFiles = [];
  notifyListeners();
};
