/**
 * Gets the type of file based on its extension or mimetype
 * 
 * @param file - The file to check
 * @returns The determined file type as a string ('pdf', 'txt', etc.)
 */
export const getFileType = (file: File): string => {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  
  // Check for document types first
  if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
    return 'document';
  }
  
  // Handle PDF files
  if (fileName.endsWith('.pdf') || fileType.includes('pdf')) {
    return 'pdf';
  }
  
  // Handle text files
  if (fileType.includes('text') || fileName.endsWith('.txt')) {
    return 'txt';
  }
  
  // Handle HTML files
  if (fileType.includes('html') || fileName.endsWith('.html') || fileName.endsWith('.htm')) {
    return 'html';
  }
  
  // Default to unknown type
  return 'unknown';
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
