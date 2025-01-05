import React, { useEffect, useRef } from "react";

interface DocumentPreviewProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const DocumentPreview = ({ file, url, selectedColor, isHighlighter = false }: DocumentPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      
      const handleClick = (e: MouseEvent) => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
          // Handle text selection
          const range = selection.getRangeAt(0);
          const span = document.createElement('span');
          if (isHighlighter) {
            span.style.backgroundColor = `${selectedColor}40`; // 40 is for 25% opacity
            span.style.padding = '0 2px';
          } else {
            span.style.color = selectedColor;
          }
          range.surroundContents(span);
          selection.removeAllRanges();
        }
      };

      container.addEventListener('mouseup', handleClick);
      return () => container.removeEventListener('mouseup', handleClick);
    }
  }, [selectedColor, isHighlighter]);

  // Handle iframe load for URL content
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && url) {
      iframe.onload = () => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            // Make iframe content editable
            iframeDoc.body.contentEditable = 'true';
            
            // Add mouseup handler to iframe content
            iframeDoc.addEventListener('mouseup', () => {
              const selection = iframeDoc.getSelection();
              if (selection && !selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                const span = document.createElement('span');
                if (isHighlighter) {
                  span.style.backgroundColor = `${selectedColor}40`;
                  span.style.padding = '0 2px';
                } else {
                  span.style.color = selectedColor;
                }
                range.surroundContents(span);
                selection.removeAllRanges();
              }
            });
          }
        } catch (error) {
          console.error('Error accessing iframe content:', error);
        }
      };
    }
  }, [url, selectedColor, isHighlighter]);

  if (!file && !url) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Upload a document or paste a URL to get started</p>
      </div>
    );
  }

  // Handle Google Docs URLs
  if (url.includes('docs.google.com')) {
    const embedUrl = url.replace('/edit', '/preview');
    return (
      <div ref={containerRef} className="w-full h-full">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-full rounded-lg border border-border"
          title="Document Preview"
        />
      </div>
    );
  }

  // For PDF files
  if (file?.type === "application/pdf") {
    const fileUrl = URL.createObjectURL(file);
    return (
      <div ref={containerRef} className="w-full h-full">
        <object
          data={fileUrl}
          type="application/pdf"
          className="w-full h-full rounded-lg border border-border"
        >
          <div className="h-full flex items-center justify-center">
            <p>Unable to display PDF. Please download and open it locally.</p>
          </div>
        </object>
      </div>
    );
  }

  // For Word documents or other files
  if (file) {
    return (
      <div ref={containerRef} className="h-full flex items-center justify-center">
        <div className="text-left p-4 max-w-2xl w-full">
          <h2 className="text-xl font-semibold mb-4">{file.name}</h2>
          <p className="text-muted-foreground">
            Word documents cannot be previewed directly.
            <br />
            Please use the download button to view the file.
          </p>
        </div>
      </div>
    );
  }

  // For other URLs
  return (
    <div ref={containerRef} className="w-full h-full">
      <iframe
        ref={iframeRef}
        src={url}
        className="w-full h-full rounded-lg border border-border"
        title="Document Preview"
      />
    </div>
  );
};
