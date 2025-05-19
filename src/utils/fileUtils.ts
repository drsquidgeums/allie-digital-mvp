
/**
 * Formats file size in bytes to a human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string with appropriate size unit
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  // Calculate the appropriate unit
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  // Format with 2 decimal places and return with unit
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Extracts the display name from a file path
 * @param path - File path or name
 * @returns Clean display name without timestamps or underscores
 */
export const getDisplayName = (path: string): string => {
  // Remove timestamp prefix if it exists
  const withoutTimestamp = path.replace(/^\d+_/, '');
  
  // Replace underscores with spaces for better display
  return withoutTimestamp.replace(/_/g, ' ');
};
