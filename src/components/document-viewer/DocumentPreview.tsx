
import React from 'react';
import { EmptyState } from './viewers/EmptyState';
import { ErrorDisplay } from './viewers/ErrorDisplay';
import { PdfViewer } from './viewers/PdfViewer';
import { WordEditor } from './viewers/word-editor/WordEditor';
import { getFileType } from './FileConverter';

interface DocumentPreviewProps {
  file: File | null;
  url: string;
  selectedColor?: string;
  isHighlighter?: boolean;
  onSave?: (content: string, fileName: string) => void;
}

/**
 * DocumentPreview Component
 * 
 * Main container component that handles different document types
 */
export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  url,
  selectedColor = '#FFFF00',
  isHighlighter = true,
  onSave
}) => {
  // Display empty state when no document is loaded
  if (!file && !url) {
    return <EmptyState />;
  }
  
  // Handle Word documents
  if (file && (file.name.endsWith('.doc') || file.name.endsWith('.docx'))) {
    return <WordEditor file={file} url="" onSave={onSave} />;
  }
  
  // Handle PDF files
  if (file && (getFileType(file) === 'pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
    return <PdfViewer file={file} url="" selectedColor={selectedColor} isHighlighter={isHighlighter} />;
  }
  
  // Handle PDF URLs
  if (url && url.toLowerCase().endsWith('.pdf')) {
    return <PdfViewer file={null} url={url} selectedColor={selectedColor} isHighlighter={isHighlighter} />;
  }

  // For text files and HTML files, use the word editor
  if (file && (getFileType(file) === 'txt' || getFileType(file) === 'html')) {
    return <WordEditor file={file} url="" onSave={onSave} />;
  }
  
  // For non-PDF URLs, try to load them in the word editor
  if (url && !url.toLowerCase().endsWith('.pdf')) {
    return <WordEditor file={null} url={url} onSave={onSave} />;
  }

  // For other file types, display basic file information with option to open in editor
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-muted/10">
      {file && (
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">File loaded</h3>
          <p><strong>Name:</strong> {file.name}</p>
          <p><strong>Type:</strong> {file.type}</p>
          <p><strong>Size:</strong> {Math.round(file.size / 1024)} KB</p>
          <div className="mt-4">
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={() => {
                // Attempt to open in word editor
                const editorContent = `<p>Imported from ${file.name}</p>`;
                if (onSave) {
                  onSave(editorContent, file.name);
                }
              }}
            >
              Open in Editor
            </button>
          </div>
        </div>
      )}
      
      {!file && url && (
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">URL loaded</h3>
          <p><strong>URL:</strong> {url}</p>
          <div className="mt-4">
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={() => {
                // Attempt to open in word editor
                const editorContent = `<p>Imported from URL: ${url}</p>`;
                if (onSave) {
                  onSave(editorContent, "Imported URL.html");
                }
              }}
            >
              Open in Editor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;
