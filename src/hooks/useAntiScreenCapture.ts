
import { useEffect } from 'react';
import { useToast } from './use-toast';

export const useAntiScreenCapture = (isEnabled: boolean = true) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!isEnabled) return;

    // Add security warning on page load
    const metaTag = document.createElement('meta');
    metaTag.name = 'httpEquiv';
    metaTag.content = 'Content is protected by NDA. Screenshots and recording prohibited.';
    document.head.appendChild(metaTag);

    // Detect Print Screen key
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key (doesn't work in all browsers due to security limitations)
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        showWarning();
        return false;
      }

      // Detect Ctrl+Shift+S, Ctrl+S, and other common screenshot shortcuts
      if ((e.ctrlKey && e.shiftKey && e.key === 's') ||
          (e.metaKey && e.shiftKey && e.key === '3') || // macOS screenshot shortcut
          (e.metaKey && e.shiftKey && e.key === '4')) { // macOS area screenshot
        e.preventDefault();
        showWarning();
        return false;
      }
    };

    // Detect browser's screenshot API
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // This might indicate a screenshot being taken in some browsers
        setTimeout(() => {
          if (document.visibilityState === 'visible') {
            showWarning();
          }
        }, 100);
      }
    };

    const showWarning = () => {
      toast({
        title: "Screenshot Detected",
        description: "Screenshots and screen recordings are prohibited under the NDA agreement.",
        variant: "destructive",
        duration: 5000,
      });
    };

    // Disable context menu to prevent "Save Image" actions
    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Apply event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', disableContextMenu);

    // Apply CSS to prevent selection
    const style = document.createElement('style');
    style.innerHTML = `
      .anti-capture-protection {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      .anti-capture-protection img, 
      .anti-capture-protection video {
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    // Apply protection class to body
    document.body.classList.add('anti-capture-protection');

    return () => {
      // Clean up
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', disableContextMenu);
      document.head.removeChild(metaTag);
      document.body.classList.remove('anti-capture-protection');
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, [isEnabled, toast]);
};
