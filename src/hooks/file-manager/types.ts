
/**
 * Represents a managed file in the application
 */
export interface ManagedFile {
  id: string;
  name: string; // Storage path/filename
  displayName?: string; // User-friendly display name (without timestamp prefix)
  size: number;
  type: string;
  lastModified: number;
  url?: string;
  file?: File;
  path?: string; // Path in Supabase storage
  folderId?: string; // Optional folder assignment for organization
}
