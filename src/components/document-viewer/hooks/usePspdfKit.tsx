
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook to initialize and manage PSPDFKit
 */
export const usePspdfKit = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFallbackRequired, setIsFallbackRequired] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializePspdfKit = async () => {
      try {
        // Check if the PSPDFKit files are accessible
        const scriptResponse = await fetch('/pspdfkit/pspdfkit.js', { method: 'HEAD' });
        const cssResponse = await fetch('/pspdfkit/pspdfkit.css', { method: 'HEAD' });
        
        if (!scriptResponse.ok || !cssResponse.ok) {
          console.log('PSPDFKit files not accessible, using fallback viewer');
          setIsFallbackRequired(true);
          throw new Error('PSPDFKit files not found. The application will use a built-in alternative PDF viewer.');
        }
        
        // Load PSPDFKit script and CSS dynamically
        const script = document.createElement('script');
        script.src = '/pspdfkit/pspdfkit.js';
        script.async = true;
        
        const link = document.createElement('link');
        link.href = '/pspdfkit/pspdfkit.css';
        link.rel = 'stylesheet';
        
        document.head.appendChild(link);
        
        script.onload = () => {
          console.log('PSPDFKit script loaded successfully');
          setIsReady(true);
        };
        
        script.onerror = (e) => {
          console.error('Error loading PSPDFKit script:', e);
          setIsFallbackRequired(true);
          setError(new Error('Failed to load PSPDFKit. Using alternative PDF viewer.'));
        };
        
        document.head.appendChild(script);
      } catch (err) {
        console.error('PSPDFKit initialization error:', err);
        setIsFallbackRequired(true);
        setError(err instanceof Error ? err : new Error('Unknown error initializing PSPDFKit'));
        
        // Show a less alarming toast message
        toast({
          title: "PDF Viewer Notice",
          description: "Using built-in PDF viewer. Some advanced features may be limited.",
        });
      }
    };
    
    initializePspdfKit();
    
    // Cleanup function to remove script and link elements
    return () => {
      const script = document.querySelector('script[src="/pspdfkit/pspdfkit.js"]');
      const link = document.querySelector('link[href="/pspdfkit/pspdfkit.css"]');
      
      if (script) {
        document.head.removeChild(script);
      }
      
      if (link) {
        document.head.removeChild(link);
      }
    };
  }, [toast]);

  return { 
    isReady, 
    error,
    isFallbackRequired 
  };
};

export default usePspdfKit;
