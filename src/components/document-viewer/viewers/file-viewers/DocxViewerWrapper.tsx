
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingFallback } from '../LoadingFallback';
import { ErrorDisplay } from '../ErrorDisplay';

// Lazy load the DocxViewer component
const DocxViewer = lazy(() => import('../DocxViewer').then(module => ({
  default: module.DocxViewer
})));

interface DocxViewerWrapperProps {
  file: File;
}

/**
 * DocxViewerWrapper Component
 * 
 * Wraps the DocxViewer component with error boundary and suspense
 */
export const DocxViewerWrapper: React.FC<DocxViewerWrapperProps> = ({ file }) => {
  const [isValidDocx, setIsValidDocx] = useState(true);
  
  useEffect(() => {
    // Validate if the file is actually a DOCX file
    const validateFile = async () => {
      try {
        if (!file.name.toLowerCase().endsWith('.docx') && !file.type.includes('wordprocessingml')) {
          console.warn("Not a valid DOCX file:", file.name, file.type);
          setIsValidDocx(false);
          return;
        }
        console.log("DocxViewerWrapper received file:", file.name, file.type);
        setIsValidDocx(true);
      } catch (error) {
        console.error("Error validating DOCX file:", error);
        setIsValidDocx(false);
      }
    };
    
    validateFile();
  }, [file]);
  
  if (!isValidDocx) {
    return (
      <ErrorDisplay 
        title="Invalid DOCX File" 
        description="The selected file doesn't appear to be a valid DOCX document." 
      />
    );
  }

  return (
    <ErrorBoundary fallback={
      <ErrorDisplay 
        title="Error Loading Document" 
        description="There was a problem loading this DOCX document. The file may be corrupted or in an unsupported format." 
      />
    }>
      <Suspense fallback={<LoadingFallback />}>
        <DocxViewer file={file} />
      </Suspense>
    </ErrorBoundary>
  );
};
