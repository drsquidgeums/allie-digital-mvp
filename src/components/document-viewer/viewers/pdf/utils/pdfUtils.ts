
import { PDFDocument, rgb } from 'pdf-lib';

/**
 * Converts a hex color code to RGB values
 * @param hexColor - Hex color code (e.g., #FF0000)
 * @returns RGB values as an object with r, g, b properties (0-1 range)
 */
export const hexToRgb = (hexColor: string) => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  return { r, g, b };
};

/**
 * Loads a PDF file from various sources (File or URL)
 * @param fileOrUrl - File object or URL string
 * @returns Promise resolving to Uint8Array containing PDF data
 */
export const loadPdfData = async (fileOrUrl: File | string): Promise<Uint8Array> => {
  let pdfData: Uint8Array;
  
  if (typeof fileOrUrl === 'string') {
    // Load from URL
    const response = await fetch(fileOrUrl);
    const arrayBuffer = await response.arrayBuffer();
    pdfData = new Uint8Array(arrayBuffer);
  } else {
    // Load from File
    const arrayBuffer = await fileOrUrl.arrayBuffer();
    pdfData = new Uint8Array(arrayBuffer);
  }
  
  return pdfData;
};

/**
 * Adds highlight annotations to a PDF document
 * @param pdfDoc - PDFDocument instance
 * @param highlights - Array of highlight objects
 * @returns PDFDocument with added highlights
 */
export const addHighlightsToPdf = async (
  pdfDoc: PDFDocument, 
  highlights: { page: number; color: string; position: { x: number; y: number; width: number; height: number } }[]
): Promise<PDFDocument> => {
  // Process each highlight
  for (const highlight of highlights) {
    // Get the page
    const pageIndex = highlight.page - 1;
    if (pageIndex < 0 || pageIndex >= pdfDoc.getPageCount()) continue;
    
    const page = pdfDoc.getPage(pageIndex);
    const { x, y, width, height } = highlight.position;
    
    // Convert color
    const { r, g, b } = hexToRgb(highlight.color);
    
    // Add highlight as rectangle
    page.drawRectangle({
      x,
      y: page.getHeight() - y - height, // PDF coordinates are bottom-up
      width,
      height,
      color: rgb(r, g, b),
      opacity: 0.3,
    });
  }
  
  return pdfDoc;
};

/**
 * Creates and triggers a download of a PDF document
 * @param pdfBytes - PDF data as Uint8Array
 * @param filename - Filename for the downloaded file
 */
export const downloadPdf = (pdfBytes: Uint8Array, filename: string): void => {
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
