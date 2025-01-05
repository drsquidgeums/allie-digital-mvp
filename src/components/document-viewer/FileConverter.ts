import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';
import EPub from 'epub';
import { marked } from 'marked';

export async function convertDocxToHtml(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return result.value;
}

export async function convertOdtToHtml(file: File): Promise<string> {
  // ODT files can be handled similarly to DOCX using mammoth
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return result.value;
}

export async function convertRtfToHtml(file: File): Promise<string> {
  // For RTF, we'll convert it to plain text first
  const text = await readTextFile(file);
  return `<div style="white-space: pre-wrap;">${text}</div>`;
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

export async function convertEpubToHtml(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create a temporary URL for the file
    const tempUrl = URL.createObjectURL(file);
    
    try {
      const epub = new EPub(tempUrl);
      let content = '';

      // Convert callback-based API to Promise
      const parseEpub = new Promise<void>((resolveEpub, rejectEpub) => {
        epub.parse();
        epub.on('end', () => {
          if (epub.flow) {
            epub.flow.forEach((chapter: any) => {
              if (chapter && typeof chapter.href === 'string') {
                epub.getChapter(chapter.id, (error: Error | null, text: string) => {
                  if (error) {
                    console.error('Error reading chapter:', error);
                  } else {
                    content += text;
                  }
                });
              }
            });
            resolveEpub();
          } else {
            rejectEpub(new Error('No content found in EPUB'));
          }
        });
        
        epub.on('error', (error: Error) => {
          rejectEpub(error);
        });
      });

      parseEpub
        .then(() => {
          // Clean up the temporary URL
          URL.revokeObjectURL(tempUrl);
          resolve(content || '<div>No content found in EPUB file</div>');
        })
        .catch((error) => {
          // Clean up the temporary URL
          URL.revokeObjectURL(tempUrl);
          reject(error);
        });
    } catch (error) {
      // Clean up the temporary URL
      URL.revokeObjectURL(tempUrl);
      console.error('Error processing EPUB:', error);
      reject(error);
    }
  });
}

export async function convertMarkdownToHtml(file: File): Promise<string> {
  const text = await readTextFile(file);
  return marked(text);
}

export function getFileType(file: File): string {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'docx':
    case 'doc':
      return 'docx';
    case 'odt':
      return 'odt';
    case 'rtf':
      return 'rtf';
    case 'txt':
      return 'txt';
    case 'html':
      return 'html';
    case 'epub':
      return 'epub';
    case 'md':
      return 'md';
    default:
      throw new Error('Unsupported file type');
  }
}