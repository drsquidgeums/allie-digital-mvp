import React from "react";

interface DocumentPreviewProps {
  file: File | null;
  url: string;
}

export const DocumentPreview = ({ file, url }: DocumentPreviewProps) => {
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
        <iframe
          src={embedUrl}
          className="w-full h-full rounded-lg border border-border"
          title="Document Preview"
        />
      );
    }

    // For other URLs, try to display them directly
    return (
      <iframe
        src={url}
        className="w-full h-full rounded-lg border border-border"
        title="Document Preview"
      />
    );
  }

  if (file?.type === "application/pdf") {
    return (
      <object
        data={url}
        type="application/pdf"
        className="w-full h-full rounded-lg border border-border"
      >
        <div className="h-full flex items-center justify-center">
          <p>Unable to display PDF. Please download and open it locally.</p>
        </div>
      </object>
    );
  }

  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-muted-foreground">
        Word documents cannot be previewed directly.
        <br />
        Please use the download button to view the file.
      </p>
    </div>
  );
};