
/**
 * Interface for files managed by the application
 */
export interface ManagedFile {
  id: string;
  name: string;
  displayName?: string; // Friendly name for display
  size: number;
  type: string;
  lastModified: number;
  url?: string;
  path?: string;
  file?: File;
  folderId?: string; // Associated folder ID
  lastAccessed?: number; // For recent files tracking
}

/**
 * Interface for file folders/categories
 */
export interface FileFolder {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
  file_count: number;
  color?: string;
  description?: string;
}

/**
 * Interface for bulk file operations
 */
export interface BulkOperation {
  type: 'move' | 'delete' | 'download';
  fileIds: string[];
  targetFolderId?: string;
  timestamp: number;
}
