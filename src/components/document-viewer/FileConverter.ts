
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export async function convertDocxToHtml(file: File): Promise<string> {
  console.log("Converting DOCX to HTML:", file.name);
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    console.log("DOCX conversion result:", result.value.substring(0, 100) + "...");
    return result.value;
  } catch (error) {
    console.error("Error converting DOCX to HTML:", error);
    throw new Error("Failed to convert DOCX document to HTML");
  }
}

export async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

export async function loadPdfDocument(file: File): Promise<ArrayBuffer> {
  return await file.arrayBuffer();
}

export function getFileType(file: File): string {
  const filename = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();
  
  console.log("Checking file type for:", filename, "MIME type:", mimeType);
  
  // Check for DOCX/DOC files
  if (
    filename.endsWith('.docx') || 
    filename.endsWith('.doc') || 
    mimeType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
    mimeType.includes('application/msword')
  ) {
    console.log("Detected as DOCX file");
    return 'docx';
  }
  
  // Check for PDF files
  if (filename.endsWith('.pdf') || mimeType.includes('application/pdf')) {
    console.log("Detected as PDF file");
    return 'pdf';
  }
  
  // Check for text files
  if (filename.endsWith('.txt') || mimeType.includes('text/plain')) {
    console.log("Detected as TXT file");
    return 'txt';
  }
  
  // Check for HTML files
  if (filename.endsWith('.html') || filename.endsWith('.htm') || 
      mimeType.includes('text/html')) {
    console.log("Detected as HTML file");
    return 'html';
  }
  
  console.warn("Unsupported file type:", filename, mimeType);
  throw new Error(`Unsupported file type: ${filename} (${mimeType})`);
}

export async function extractTextFromFile(file: File): Promise<string> {
  try {
    const fileType = getFileType(file);
    
    switch (fileType) {
      case 'pdf':
        return extractTextFromPdf(file);
      case 'docx':
        const html = await convertDocxToHtml(file);
        return stripHtmlTags(html);
      case 'txt':
        return readTextFile(file);
      case 'html':
        const content = await readTextFile(file);
        return stripHtmlTags(content);
      default:
        throw new Error('Unsupported file type for text extraction');
    }
  } catch (error) {
    console.error("Error extracting text from file:", error);
    return `Failed to extract text from ${file.name}`;
  }
}

async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let textContent = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => 'str' in item ? item.str : '');
      textContent += strings.join(' ') + '\n';
    }
    
    return textContent;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return 'Failed to extract text from PDF';
  }
}

function stripHtmlTags(html: string): string {
  // Remove HTML tags and decode entities
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}
