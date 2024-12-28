import React, { useEffect, useRef } from "react";

interface DocumentPreviewProps {
  file: File | null;
  url: string;
  selectedColor: string;
}

export const DocumentPreview = ({ file, url, selectedColor }: DocumentPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // Handle text selection
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
          const range = selection.getRangeAt(0);
          const span = document.createElement('span');
          span.style.color = selectedColor;
          range.surroundContents(span);
          selection.removeAllRanges();
        } else if (target.tagName === 'P' || target.tagName === 'SPAN' || target.tagName === 'DIV') {
          // Handle single click on text
          if (target.childNodes.length === 1 && target.childNodes[0].nodeType === Node.TEXT_NODE) {
            target.style.color = selectedColor;
          } else {
            target.childNodes.forEach(node => {
              if (node.nodeType === Node.TEXT_NODE) {
                const span = document.createElement('span');
                span.textContent = node.textContent;
                span.style.color = selectedColor;
                node.parentNode?.replaceChild(span, node);
              }
            });
          }
        }
      };

      container.addEventListener('click', handleClick);
      return () => container.removeEventListener('click', handleClick);
    }
  }, [selectedColor]);

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
  if (url) {
    return (
      <div ref={containerRef} className="w-full h-full">
        <iframe
          src={url}
          className="w-full h-full rounded-lg border border-border"
          title="Document Preview"
        />
      </div>
    );
  }

  return null;
};