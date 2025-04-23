
import { useState, useEffect } from 'react';

/**
 * Custom hook to check if PSPDFKit is available
 * Falls back to react-pdf if PSPDFKit is not found
 */
export const usePspdfkitAvailability = () => {
  const [useFallback, setUseFallback] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkPspdfkit = async () => {
      try {
        setIsChecking(true);
        const response = await fetch('/pspdfkit/pspdfkit.js', { method: 'HEAD' });
        if (!response.ok) {
          setUseFallback(true);
          console.log('PSPDFKit not available, using fallback PDF viewer');
        } else {
          setUseFallback(false);
          console.log('PSPDFKit is available');
        }
      } catch (error) {
        setUseFallback(true);
        console.log('Error checking PSPDFKit, using fallback PDF viewer:', error);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkPspdfkit();
  }, []);

  return { 
    useFallback,
    isChecking
  };
};

export default usePspdfkitAvailability;
