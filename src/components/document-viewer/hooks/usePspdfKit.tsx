
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
    const checkPspdfKit = async () => {
      try {
        // Check if the PSPDFKit files are accessible
        const response = await fetch('/pspdfkit/pspdfkit.js', { method: 'HEAD' });
        
        if (!response.ok) {
          throw new Error('PSPDFKit files not found. Make sure PSPDFKit is properly installed.');
        }
        
        setIsReady(true);
        console.log('PSPDFKit resources verified successfully');
      } catch (err) {
        console.error('PSPDFKit initialization error:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing PSPDFKit'));
        
        toast({
          variant: "destructive",
          title: "PSPDFKit Error",
          description: "Could not load PDF viewer. Some features may be unavailable.",
        });
      }
    };
    
    checkPspdfKit();
  }, []);

  return { 
    isReady, 
    error 
  };
};

export default usePspdfKit;
