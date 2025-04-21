
/**
 * Gets the type of file based on its extension or mimetype
 * 
 * @param file - The file to check
 * @returns The determined file type as a string ('pdf', 'txt', etc.)
 */
export const getFileType = (file: File): string => {
  if (!file) return 'unknown';
  
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  
  // Check for Microsoft Word document types
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
  if (!file) return '';
  
  try {
    // For text files, simply read as text
    if (file.type.includes('text/') || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.html') || 
        file.name.endsWith('.htm')) {
      return await file.text();
    }
    
    // For Word documents, we'll need to implement Word document parsing
    if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      // Basic placeholder for now
      return `Content from ${file.name}`;
    }
    
    // For other file types, return a placeholder message
    return `Text extraction not yet implemented for ${file.type} files`;
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return `Error extracting text from ${file.name}`;
  }
};

/**
 * Reads a text file and returns its content
 * 
 * @param file - The text file to read
 * @returns Promise that resolves to the text content
 */
export const readTextFile = async (file: File): Promise<string> => {
  if (!file) return '';
  
  try {
    return await file.text();
  } catch (error) {
    console.error('Error reading text file:', error);
    return 'Could not read file content';
  }
};
