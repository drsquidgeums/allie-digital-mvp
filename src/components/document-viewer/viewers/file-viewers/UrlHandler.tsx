
import React, { useEffect, useState } from 'react';
import { isValidUrl } from '../../urlUtils';
import { IframeViewer } from '../IframeViewer';
import { PdfViewerWrapper } from './PdfViewerWrapper';
import { RichTextEditorWrapper } from './RichTextEditorWrapper';
import { ErrorDisplay } from '../ErrorDisplay';

interface UrlHandlerProps {
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
  onError: (error: Error) => void;
}

export const UrlHandler: React.FC<UrlHandlerProps> = ({
  url,
  selectedColor,
  isHighlighter,
  onError
}) => {
  const [urlType, setUrlType] = useState<'pdf' | 'text' | 'iframe' | null>(null);
  const [useRichEditor, setUseRichEditor] = useState<boolean>(false);

  useEffect(() => {
    if (!isValidUrl(url)) {
      onError(new Error('Invalid URL'));
      return;
    }

    // Determine the type of content based on URL
    try {
      const lowerUrl = url.toLowerCase();
      if (lowerUrl.endsWith('.pdf')) {
        setUrlType('pdf');
      } else if (lowerUrl.endsWith('.txt') || lowerUrl.endsWith('.html') || lowerUrl.endsWith('.doc') || lowerUrl.endsWith('.docx')) {
        setUrlType('text');
      } else {
        setUrlType('iframe');
      }
    } catch (error) {
      onError(error as Error);
    }
  }, [url, onError]);

  const toggleEditor = () => {
    setUseRichEditor(!useRichEditor);
  };

  // If URL type is not yet determined
  if (!urlType) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle different URL types
  switch (urlType) {
    case 'pdf':
      return (
        <PdfViewerWrapper
          url={url}
          selectedColor={selectedColor}
          isHighlighter={isHighlighter}
        />
      );
    case 'text':
      return useRichEditor ? (
        <RichTextEditorWrapper
          url={url}
          selectedColor={selectedColor}
          isHighlighter={isHighlighter}
        />
      ) : (
        <div className="h-full flex flex-col">
          <div className="p-2 bg-muted/20 border-b flex justify-end">
            <button 
              onClick={toggleEditor}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Open in Editor
            </button>
          </div>
          <IframeViewer url={url} />
        </div>
      );
    case 'iframe':
      return <IframeViewer url={url} />;
    default:
      return (
        <ErrorDisplay 
          title="Unsupported URL" 
          description="The URL you've entered points to content that cannot be displayed." 
        />
      );
  }
};
