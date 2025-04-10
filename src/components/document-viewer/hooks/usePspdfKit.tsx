
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook to initialize and manage PSPDFKit
 */
export const usePspdfKit = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializePspdfKit = async () => {
      try {
        // Check if the PSPDFKit files are accessible
        const scriptResponse = await fetch('/pspdfkit/pspdfkit.js', { method: 'HEAD' });
        const cssResponse = await fetch('/pspdfkit/pspdfkit.css', { method: 'HEAD' });
        
        if (!scriptResponse.ok || !cssResponse.ok) {
          throw new Error('PSPDFKit files not found. Please make sure PSPDFKit is properly set up.');
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
          setError(new Error('Failed to load PSPDFKit script. Make sure it is properly installed.'));
        };
        
        document.head.appendChild(script);
      } catch (err) {
        console.error('PSPDFKit initialization error:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing PSPDFKit'));
        
        toast({
          variant: "destructive",
          title: "PSPDFKit Error",
          description: "Could not initialize PSPDFKit. Some features may be unavailable.",
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
    error 
  };
};

export default usePspdfKit;
