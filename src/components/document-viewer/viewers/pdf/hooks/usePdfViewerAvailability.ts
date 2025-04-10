
import { useState, useEffect } from 'react';

/**
 * Enum for PDF viewer types
 */
export enum PdfViewerType {
  PSPDFKIT = 'pspdfkit',
  PDFIUM = 'pdfium',
  REACT_PDF = 'react-pdf'
}

/**
 * Custom hook to check available PDF viewers and select the best one
 * Priority: PSPDFKit > PDFium > React-PDF
 */
export const usePdfViewerAvailability = () => {
  const [viewerType, setViewerType] = useState<PdfViewerType>(PdfViewerType.REACT_PDF);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkViewers = async () => {
      try {
        setIsChecking(true);
        
        // First check if PSPDFKit is available
        try {
          const pspdfkitResponse = await fetch('/pspdfkit/pspdfkit.js', { method: 'HEAD' });
          if (pspdfkitResponse.ok) {
            setViewerType(PdfViewerType.PSPDFKIT);
            console.log('PSPDFKit is available, using it as primary PDF viewer');
            setIsChecking(false);
            return;
          }
        } catch (error) {
          console.log('PSPDFKit not available:', error);
        }
        
        // Then check if PDFium is available (browsers with built-in PDF support)
        // This is a basic check - in a real implementation we might use feature detection
        const isPdfiumSupported = 'PDFViewerApplication' in window || 
                                 (navigator.pdfViewerEnabled !== undefined);
        
        if (isPdfiumSupported) {
          setViewerType(PdfViewerType.PDFIUM);
          console.log('PDFium is available, using browser PDF viewer');
        } else {
          // Fall back to React-PDF
          setViewerType(PdfViewerType.REACT_PDF);
          console.log('Using React-PDF fallback viewer');
        }
      } catch (error) {
        console.log('Error checking PDF viewers, using fallback viewer:', error);
        setViewerType(PdfViewerType.REACT_PDF);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkViewers();
  }, []);

  return { 
    viewerType,
    isChecking,
    isPspdfkit: viewerType === PdfViewerType.PSPDFKIT,
    isPdfium: viewerType === PdfViewerType.PDFIUM,
    isReactPdf: viewerType === PdfViewerType.REACT_PDF
  };
};

export default usePdfViewerAvailability;
