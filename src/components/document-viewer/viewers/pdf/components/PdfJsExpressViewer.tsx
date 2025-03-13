
import React, { useRef } from 'react';
import { PdfJsToolbar } from './pdf-js-express/PdfJsToolbar';
import PdfJsLoading from './pdf-js-express/PdfJsLoading';
import { usePdfJsExpress } from '../hooks/usePdfJsExpress';

interface PdfJsExpressViewerProps {
  file: File | null;
  url: string;
  selectedColor: string;
  isHighlighter?: boolean;
}

export const PdfJsExpressViewer: React.FC<PdfJsExpressViewerProps> = ({
  file,
  url,
  selectedColor,
  isHighlighter = true
}) => {
  const viewer = useRef<HTMLDivElement>(null);
  const { instance, isLoading } = usePdfJsExpress({
    containerRef: viewer,
    file,
    url,
    selectedColor,
    isHighlighter
  });

  return (
    <div className="h-full flex flex-col">
      {instance && <PdfJsToolbar instance={instance} isHighlighter={isHighlighter} />}
      
      <div className="flex-1 overflow-auto">
        {isLoading && <PdfJsLoading />}
        <div className="h-full w-full" ref={viewer}></div>
      </div>
    </div>
  );
};
