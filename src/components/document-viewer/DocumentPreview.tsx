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
        if (target.tagName === 'P' || target.tagName === 'SPAN' || target.tagName === 'DIV') {
          target.style.color = selectedColor;
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

  if (url) {
    // Handle Google Docs URLs by converting them to embed format
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

    // For other URLs, try to display them directly
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

  if (file?.type === "application/pdf") {
    return (
      <div ref={containerRef} className="w-full h-full">
        <object
          data={url}
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

  return (
    <div ref={containerRef} className="h-full flex items-center justify-center">
      <p className="text-muted-foreground">
        Word documents cannot be previewed directly.
        <br />
        Please use the download button to view the file.
      </p>
    </div>
  );
};