import { useState, useCallback, useEffect, useRef } from "react";
import { useToast } from "../use-toast";
import { useFullscreen } from "../useFullscreen";
import { FocusSettings, FocusSession, useFocusSettings } from "../useFocusSettings";

export const useFocusModeControl = () => {
  const [isActive, setIsActive] = useState(false);
  const { enterFullscreen, exitFullscreen, isFullscreen } = useFullscreen();
  const { toast } = useToast();
  const { settings, addSession, updateCurrentSession } = useFocusSettings();
  const sessionTimerRef = useRef<number | null>(null);

  // Define toggleFocusMode before it's used in useEffect
  const toggleFocusMode = useCallback(async () => {
    try {
      if (!isActive) {
        // Activate focus mode
        await enterFullscreen();
        setIsActive(true);
        localStorage.setItem('focusModeActive', 'true');
        
        // Start a new focus session
        const newSession: FocusSession = {
          startTime: Date.now(),
          endTime: null,
          duration: 0,
          completed: false,
          interrupted: false
        };
        addSession(newSession);
        
        // Start session timer
        sessionTimerRef.current = window.setInterval(() => {
          updateCurrentSession({
            duration: Math.floor((Date.now() - newSession.startTime) / 1000)
          });
        }, 1000);
        
        // Dispatch focus mode event with settings
        window.dispatchEvent(new CustomEvent('focusModeChanged', { 
          detail: { 
            active: true,
            settings: settings
          } 
        }));
        
        // If auto breaks are enabled, set a timer to remind the user
        if (settings.autoBreaks && settings.focusDuration > 0) {
          setTimeout(() => {
            toast({
              title: "Time for a break",
              description: `You've been focusing for ${settings.focusDuration} minutes`,
            });
          }, settings.focusDuration * 60 * 1000);
        }
        
      } else {
        // Deactivate focus mode
        await exitFullscreen();
        setIsActive(false);
        localStorage.setItem('focusModeActive', 'false');
        
        // End the current session
        if (sessionTimerRef.current) {
          clearInterval(sessionTimerRef.current);
          sessionTimerRef.current = null;
        }
        
        updateCurrentSession({
          endTime: Date.now(),
          completed: true
        });
        
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
      
      // Mark session as interrupted
      updateCurrentSession({
        endTime: Date.now(),
        interrupted: true
      });
      
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
      
      toast({
        title: "Focus mode error",
        description: "There was an error with focus mode. Please try again.",
        variant: "destructive"
      });
    }
  }, [isActive, settings, enterFullscreen, exitFullscreen, toast, addSession, updateCurrentSession]);

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
        
        // End the current session
        if (sessionTimerRef.current) {
          clearInterval(sessionTimerRef.current);
          sessionTimerRef.current = null;
        }
        
        updateCurrentSession({
          endTime: Date.now(),
          interrupted: true
        });
        
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
  }, [isActive, updateCurrentSession]);

  // Check initial state on component mount - much more robust now!
  useEffect(() => {
    const checkInitialState = () => {
      // Only consider localStorage value if we're actually in fullscreen mode
      const storedState = localStorage.getItem('focusModeActive') === 'true';
      const isActuallyFullscreen = Boolean(
        document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).mozFullScreenElement || 
        (document as any).msFullscreenElement
      );
      
      // If localStorage says focus mode is active but we're not in fullscreen,
      // that's an inconsistency we need to fix
      if (storedState && !isActuallyFullscreen) {
        console.log("Found inconsistent focus mode state, resetting to inactive");
        setIsActive(false);
        localStorage.setItem('focusModeActive', 'false');
        
        // Also notify any listeners that might be depending on this state
        window.dispatchEvent(new CustomEvent('focusModeChanged', { 
          detail: { 
            active: false,
            settings: null
          } 
        }));
      } else {
        // Otherwise, set state based on actual fullscreen state
        setIsActive(isActuallyFullscreen);
      }
    };

    // Check state immediately on mount
    checkInitialState();
    
    // Also listen for focus mode change events
    const handleFocusModeChange = (event: CustomEvent) => {
      const { active } = event.detail;
      setIsActive(active);
    };

    window.addEventListener('focusModeChanged', handleFocusModeChange as EventListener);
    return () => {
      window.removeEventListener('focusModeChanged', handleFocusModeChange as EventListener);
      
      // Also clear any running timers on unmount
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, []);

  // Function to schedule a focus session for later
  const scheduleFocusSession = (timeInMinutes: number) => {
    toast({
      title: "Focus session scheduled",
      description: `A focus session will start in ${timeInMinutes} minutes`,
    });
    
    setTimeout(() => {
      if (!isActive) {
        toggleFocusMode();
        toast({
          title: "Scheduled focus session started",
          description: "Your focus session is now active",
        });
      }
    }, timeInMinutes * 60 * 1000);
  };

  return { isActive, toggleFocusMode, scheduleFocusSession };
};
