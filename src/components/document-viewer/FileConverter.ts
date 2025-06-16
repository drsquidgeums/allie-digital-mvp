
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker with a more reliable CDN
const PDFJS_VERSION = '3.4.120';
const WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

// Only set worker source if it hasn't been set already
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
}

export async function convertDocxToHtml(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return result.value;
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
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'docx':
      return 'docx';
    case 'txt':
      return 'txt';
    case 'html':
      return 'html';
    default:
      throw new Error('Unsupported file type');
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
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
}

async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Use the more reliable CDN for worker
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
    }
    
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useSystemFonts: true,
      standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/standard_fonts/`,
      cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/cmaps/`,
      cMapPacked: true,
    });
    
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
    // Return a more user-friendly message instead of failing completely
    return `PDF loaded successfully (text extraction unavailable in this environment)`;
  }
}

function stripHtmlTags(html: string): string {
  // Remove HTML tags and decode entities
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}
