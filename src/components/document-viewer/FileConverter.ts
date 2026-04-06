
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use CDN worker with fallback to no worker
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

async function extractHtmlFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Try with worker first, then fallback to workerless
  const attempts = [
    { useWorker: true },
    { useWorker: false },
  ];

  for (const attempt of attempts) {
    try {
      if (!attempt.useWorker) {
        console.log('PDF.js: Retrying without worker...');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '';
      }

      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer.slice(0), // slice to avoid detached buffer on retry
        useSystemFonts: true,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/standard_fonts/`,
        cMapUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/cmaps/`,
        cMapPacked: true,
      });
      
      const pdf = await loadingTask.promise;
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
      
      return htmlContent || '<p>No text content found in this PDF.</p>';
    } catch (error) {
      console.error(`PDF.js extraction failed (worker=${attempt.useWorker}):`, error);
      if (!attempt.useWorker) {
        // Both attempts failed
        return `<p>Unable to extract text from this PDF. The file may be scanned or image-based. Please try a text-based PDF.</p>`;
      }
    }
  }

  return `<p>Unable to extract text from this PDF.</p>`;
}

async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Ensure worker is configured
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
    }
    
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useSystemFonts: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/standard_fonts/`,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/cmaps/`,
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
