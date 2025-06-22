
import { useCallback } from 'react';

export const useSessionManager = () => {
  const getSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem('security_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('security_session_id', sessionId);
    }
    return sessionId;
  }, []);

  const getFingerprint = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillText('fingerprint', 10, 10);
      }
      const canvasFingerprint = canvas.toDataURL();
      
      return btoa(
        navigator.userAgent + 
        navigator.language + 
        screen.width + 
        screen.height + 
        new Date().getTimezoneOffset() +
        canvasFingerprint.slice(-50)
      ).slice(0, 16);
    } catch (error) {
      // Fallback fingerprint if canvas fails
      return btoa(
        navigator.userAgent + 
        navigator.language + 
        Date.now().toString()
      ).slice(0, 16);
    }
  }, []);

  return {
    getSessionId,
    getFingerprint
  };
};
