
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
}
