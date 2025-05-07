
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingFallback } from '../LoadingFallback';
import { ErrorDisplay } from '../ErrorDisplay';
import { toast } from '@/hooks/use-toast';

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
  const [validationError, setValidationError] = useState<string | null>(null);
  
  useEffect(() => {
    // Validate if the file is actually a DOCX file
    const validateFile = async () => {
      try {
        console.log("DocxViewerWrapper validating file:", file.name, file.type);
        
        const isDocxByExtension = file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc');
        const isDocxByMime = file.type.includes('wordprocessingml') || file.type.includes('msword');
        
        if (!isDocxByExtension && !isDocxByMime) {
          console.warn("Not a valid DOCX file by name or MIME type:", file.name, file.type);
          setValidationError("The selected file doesn't appear to be a valid DOCX document based on its name or type.");
          setIsValidDocx(false);
          return;
        }
        
        // Try to access the file to make sure it's readable
        try {
          const arrayBuffer = await file.arrayBuffer();
          if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            throw new Error("File is empty or unreadable");
          }
        } catch (error) {
          console.error("Error reading file:", error);
          setValidationError("Unable to read the file content. The file may be corrupted.");
          setIsValidDocx(false);
          return;
        }
        
        console.log("DocxViewerWrapper file validation successful:", file.name);
        setIsValidDocx(true);
        setValidationError(null);
      } catch (error) {
        console.error("Error validating DOCX file:", error);
        setValidationError("There was an error validating the file. Please try again with a different file.");
        setIsValidDocx(false);
        toast({
          title: "File Error",
          description: "Failed to validate the DOCX file",
          variant: "destructive",
        });
      }
    };
    
    validateFile();
  }, [file]);
  
  if (!isValidDocx) {
    return (
      <ErrorDisplay 
        title="Invalid DOCX File" 
        description={validationError || "The selected file doesn't appear to be a valid DOCX document."} 
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
