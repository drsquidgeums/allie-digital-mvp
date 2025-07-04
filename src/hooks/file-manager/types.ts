
/**
 * Represents a managed file in the application
 */
export interface ManagedFile {
  id: string;
  name: string;
  displayName?: string;
  size: number;
  type: string;
  lastModified: number;
  url?: string;
  file?: File;
  path?: string; // Path in Supabase storage
  folderId?: string; // For organizing files into folders
  metadata?: Record<string, any>; // Additional metadata
}

/**
 * File upload options
 */
export interface FileUploadOptions {
  originalName?: string;
  folderId?: string;
  metadata?: Record<string, any>;
  overwrite?: boolean;
}

/**
 * File operation result
 */
export interface FileOperationResult {
  success: boolean;
  file?: ManagedFile;
  error?: string;
}
