
/**
 * Represents a managed file in the application
 */
export interface ManagedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  url?: string;
  file?: File;
  path?: string; // Path in Supabase storage
}
