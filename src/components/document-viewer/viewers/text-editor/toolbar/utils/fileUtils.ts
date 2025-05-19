
import { Editor } from '@tiptap/react';
import { htmlToPlainText } from '../../textFormatUtils';

/**
 * Generates a safe filename from the document title
 */
export const generateFileName = (documentTitle: string, extension: string): string => {
  return documentTitle === 'Untitled Document'
    ? `document_${new Date().toISOString().slice(0, 10)}.${extension}`
    : `${documentTitle.replace(/\.(html|doc|docx|txt)$/i, '')}.${extension}`;
};

/**
 * Creates a document header for Word documents
 */
export const createDocumentHeader = (documentTitle: string): string => {
  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${documentTitle}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>90</w:Zoom>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        /* Add some basic styling */
        body {
          font-family: 'Calibri', sans-serif;
          font-size: 11pt;
        }
        p {
          margin: 0;
          padding: 0;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
  `;
};

/**
 * Creates a document footer for Word documents
 */
export const createDocumentFooter = (): string => {
  return `
    </body>
    </html>
  `;
};

/**
 * Creates and triggers a file download
 */
export const triggerDownload = (content: string, fileName: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
