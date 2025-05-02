
import { useState, useCallback, useEffect } from "react";
import { useToast } from "../use-toast";
import { useFullscreen } from "../useFullscreen";
import { FocusModeSettings } from "../useFocusMode";

interface FocusModeControlOptions extends FocusModeSettings {}

export const useFocusModeControl = (defaultSettings: FocusModeControlOptions) => {
  const [isActive, setIsActive] = useState(false);
  const { enterFullscreen, exitFullscreen } = useFullscreen();
  const { toast } = useToast();

  // Check localStorage on component mount
  useEffect(() => {
    const storedState = localStorage.getItem('focusModeActive');
    if (storedState === 'true') {
      setIsActive(true);
    }
  }, []);

  // Define toggleFocusMode before it's used in useEffect
  const toggleFocusMode = useCallback(async () => {
    try {
      const newState = !isActive;
      
      if (newState) {
        // Activate focus mode
        await enterFullscreen();
        setIsActive(true);
        localStorage.setItem('focusModeActive', 'true');
        
        // Dispatch focus mode event with default settings
        window.dispatchEvent(new CustomEvent('focusModeChanged', { 
          detail: { 
            active: true,
            settings: defaultSettings
          } 
        }));
        
      } else {
        // Deactivate focus mode
        await exitFullscreen();
        setIsActive(false);
        localStorage.setItem('focusModeActive', 'false');
        
        // Dispatch focus mode event
        window.dispatchEvent(new CustomEvent('focusModeChanged', { 
          detail: { 
            active: false,
            settings: null
          } 
        }));
      }
      
      return true;
    } catch (error) {
      console.error("Error toggling focus mode:", error);
      setIsActive(false);
      localStorage.removeItem('focusModeActive');
      toast({
        title: "Focus mode error",
        description: "There was an error with focus mode. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [isActive, defaultSettings, enterFullscreen, exitFullscreen, toast]);

  // Monitor fullscreen changes directly from browser events
  useEffect(() => {
    const handleFullscreenChange = () => {
      // If we were in focus mode but fullscreen was exited (via Escape or other means)
      if (isActive && !document.fullscreenElement && 
          !(document as any).webkitFullscreenElement && 
          !(document as any).mozFullScreenElement && 
          !(document as any).msFullscreenElement) {
        
        // Update state and localStorage
        setIsActive(false);
        localStorage.setItem('focusModeActive', 'false');
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('focusModeChanged', { 
          detail: { 
            active: false,
            settings: null
          } 
        }));
      }
    };

    // Add event listeners for all browser variants
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      // Remove event listeners on cleanup
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isActive]);

  // Listen for global focus mode exit events
  useEffect(() => {
    const handleFocusModeExit = () => {
      setIsActive(false);
    };
    
    // Listen for focusModeChanged events to stay in sync
    const handleFocusModeChange = (event: CustomEvent<{active: boolean}>) => {
      setIsActive(event.detail.active);
    };
    
    window.addEventListener('focusModeExit', handleFocusModeExit);
    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    
    return () => {
      window.removeEventListener('focusModeExit', handleFocusModeExit);
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    };
  }, []);

  return { isActive, toggleFocusMode };
};
