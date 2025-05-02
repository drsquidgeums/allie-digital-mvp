
import { useState, useCallback, useEffect } from "react";
import { useToast } from "../use-toast";
import { useFullscreen } from "../useFullscreen";
import { FocusSettings } from "../useFocusSettings";

interface FocusModeControlOptions extends FocusSettings {}

export const useFocusModeControl = (defaultSettings: FocusModeControlOptions) => {
  const [isActive, setIsActive] = useState(false);
  const { enterFullscreen, exitFullscreen } = useFullscreen();
  const { toast } = useToast();

  // Define toggleFocusMode before it's used in useEffect
  const toggleFocusMode = useCallback(async () => {
    try {
      if (!isActive) {
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
    } catch (error) {
      console.error("Error toggling focus mode:", error);
      setIsActive(false);
      localStorage.removeItem('focusModeActive');
      toast({
        title: "Focus mode error",
        description: "There was an error with focus mode. Please try again.",
        variant: "destructive"
      });
    }
  }, [isActive, defaultSettings, enterFullscreen, exitFullscreen, toast]);

  // Handler for manual exit via X button
  const handleManualExit = useCallback(async () => {
    if (isActive) {
      try {
        await exitFullscreen();
        setIsActive(false);
        localStorage.setItem('focusModeActive', 'false');
        
        // Dispatch focus mode event for deactivation
        window.dispatchEvent(new CustomEvent('focusModeChanged', { 
          detail: { 
            active: false,
            settings: null
          } 
        }));
        
        toast({
          title: "Focus mode deactivated",
          description: "Returning to normal mode",
        });
      } catch (error) {
        console.error("Error exiting focus mode:", error);
      }
    }
  }, [isActive, exitFullscreen, toast]);

  // Handle Escape key to exit focus mode
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (isActive && event.key === 'Escape') {
        event.preventDefault();
        toggleFocusMode();
      }
    };

    // Add event listener when focus mode is active
    if (isActive) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    // Cleanup listener
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive, toggleFocusMode]);

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
        
        console.log("Focus mode deactivated due to fullscreen exit");
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
    const handleFocusModeExit = (event: Event) => {
      setIsActive(false);
      localStorage.setItem('focusModeActive', 'false');
    };
    
    window.addEventListener('focusModeExit', handleFocusModeExit);
    
    return () => {
      window.removeEventListener('focusModeExit', handleFocusModeExit);
    };
  }, []);

  // Sync with focus mode state
  useEffect(() => {
    const handleFocusModeChange = (event: CustomEvent) => {
      const { active } = event.detail;
      setIsActive(active);
    };

    // Check initial state
    const storedState = localStorage.getItem('focusModeActive');
    if (storedState === 'true') {
      setIsActive(true);
    }

    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    return () => {
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    };
  }, []);

  return { isActive, toggleFocusMode, handleManualExit };
};
