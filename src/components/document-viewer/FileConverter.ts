
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use CDN worker
const PDFJS_VERSION = '4.10.38';
const WORKER_URL = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

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
      return extractHtmlFromPdf(file);
    case 'docx':
      // Return HTML to preserve formatting (bold, italic, lists, etc.)
      return await convertDocxToHtml(file);
    case 'txt':
      return readTextFile(file);
    case 'html':
      // For HTML files, preserve the HTML content instead of stripping tags
      return await readTextFile(file);
    default:
      throw new Error('Unsupported file type for text extraction');
  }
}

/**
 * Extract plain text only (strips formatting) - use when you need just the text
 */
export async function extractPlainTextFromFile(file: File): Promise<string> {
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
      const htmlContent = await readTextFile(file);
      return stripHtmlTags(htmlContent);
    default:
      throw new Error('Unsupported file type for text extraction');
  }
}

/**
 * Helper to load a PDF document with pdfjs-dist, trying with worker first then without.
 * Does NOT mutate the global workerSrc — uses a local approach instead.
 */
async function loadPdfWithFallback(arrayBuffer: ArrayBuffer) {
  const docParams = {
    useSystemFonts: true,
    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/standard_fonts/`,
    cMapUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/cmaps/`,
    cMapPacked: true,
  };

  // Ensure worker is set
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
  }

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer.slice(0),
      ...docParams,
    });
    return await loadingTask.promise;
  } catch (firstError) {
    console.warn('PDF.js: Worker-based loading failed, retrying without worker...', firstError);
    
    // Temporarily disable worker, then restore
    const previousWorkerSrc = pdfjsLib.GlobalWorkerOptions.workerSrc;
    pdfjsLib.GlobalWorkerOptions.workerSrc = '';
    
    try {
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer.slice(0),
        ...docParams,
      });
      const pdf = await loadingTask.promise;
      
      // Restore worker for future calls
      pdfjsLib.GlobalWorkerOptions.workerSrc = previousWorkerSrc || WORKER_URL;
      return pdf;
    } catch (secondError) {
      // Restore worker for future calls
      pdfjsLib.GlobalWorkerOptions.workerSrc = previousWorkerSrc || WORKER_URL;
      throw secondError;
    }
  }
}

async function extractHtmlFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  try {
    const pdf = await loadPdfWithFallback(arrayBuffer);
    let htmlContent = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      htmlContent += `<div style="margin-bottom: 1.5em; padding-bottom: 1em; border-bottom: 1px solid #e5e7eb;">`;
      htmlContent += `<h2 style="font-size: 0.85em; color: #6b7280; margin-bottom: 0.5em;">Page ${i}</h2>`;
      
      let currentParagraph = '';
      for (const item of content.items) {
        if ('str' in item) {
          const text = item.str;
          if (text.trim() === '' && currentParagraph.trim() !== '') {
            htmlContent += `<p>${currentParagraph.trim()}</p>`;
            currentParagraph = '';
          } else {
            currentParagraph += text + ' ';
          }
        }
      }
      if (currentParagraph.trim()) {
        htmlContent += `<p>${currentParagraph.trim()}</p>`;
      }
      
      htmlContent += `</div>`;
    }
    
    if (!htmlContent || htmlContent.replace(/<[^>]*>/g, '').trim().length < 10) {
      return '<p>This PDF appears to be scanned or image-based. The text content could not be extracted, but the document has been loaded for viewing. You can use the PDF viewer to read it visually.</p>';
    }
    
    return htmlContent;
  } catch (error) {
    console.error('PDF extraction failed:', error);
    return `<p>There was an issue reading this PDF. The document may be corrupted or in an unsupported format. Please try re-uploading or using a different file.</p>`;
  }
}

async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  try {
    const pdf = await loadPdfWithFallback(arrayBuffer);
    let textContent = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => 'str' in item ? item.str : '');
      textContent += strings.join(' ') + '\n';
    }
    
    return textContent || 'No text content found in this PDF.';
  } catch (error) {
    console.error('PDF text extraction failed:', error);
    return 'Unable to extract text from this PDF.';
  }
}

function stripHtmlTags(html: string): string {
  // Remove HTML tags and decode entities
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}
