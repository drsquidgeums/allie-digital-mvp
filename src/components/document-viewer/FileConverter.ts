
/**
 * Gets the type of file based on its extension or mimetype
 * 
 * @param file - The file to check
 * @returns The determined file type as a string ('pdf', 'txt', etc.)
 */
export const getFileType = (file: File): string => {
  // First check by mimetype
  if (file.type) {
    if (file.type.includes('pdf')) return 'pdf';
    if (file.type.includes('text/plain')) return 'txt';
    if (file.type.includes('text/html')) return 'html';
  }
  
  // Fallback to extension check
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return 'pdf';
  if (name.endsWith('.txt')) return 'txt';
  if (name.endsWith('.html') || name.endsWith('.htm')) return 'html';
  
  // Return original type if no match
  return file.type.split('/')[0] || 'unknown';
};

/**
 * Extracts text content from a file
 * 
 * @param file - The file to extract text from
 * @returns Promise that resolves to the extracted text content
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  // For text files, simply read as text
  if (file.type.includes('text/') || file.name.endsWith('.txt')) {
    return await file.text();
  }
  
  // For other file types, return a placeholder message
  return `Text extraction not yet implemented for ${file.type} files`;
};

/**
 * Reads a text file and returns its content
 * 
 * @param file - The text file to read
 * @returns Promise that resolves to the text content
 */
export const readTextFile = async (file: File): Promise<string> => {
  try {
    return await file.text();
  } catch (error) {
    console.error('Error reading text file:', error);
    return 'Could not read file content';
  }
};
