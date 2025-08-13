import { useEffect } from 'react';

const SESSION_VERSION = "v1.0"; // Must match the version in PasswordGate.tsx

export const useSessionValidation = (onSessionInvalid: () => void) => {
  useEffect(() => {
    const validateSession = () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      const storedVersion = localStorage.getItem("sessionVersion");
      
      // If user is authenticated but version doesn't match, invalidate session
      if (isAuthenticated === "true" && storedVersion !== SESSION_VERSION) {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("sessionVersion");
        onSessionInvalid();
      }
    };

    // Check immediately
    validateSession();
    
    // Check every 30 seconds
    const interval = setInterval(validateSession, 30000);
    
    // Also check when the window gains focus (user switches back to tab)
    const handleFocus = () => validateSession();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [onSessionInvalid]);
};