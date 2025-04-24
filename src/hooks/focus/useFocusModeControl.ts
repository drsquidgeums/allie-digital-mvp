
import { useState, useCallback } from "react";
import { useToast } from "../use-toast";
import { useFullscreen } from "../useFullscreen";
import { FocusSettings } from "../useFocusSettings";

interface FocusModeControlOptions extends FocusSettings {}

export const useFocusModeControl = (defaultSettings: FocusModeControlOptions) => {
  const [isActive, setIsActive] = useState(false);
  const { enterFullscreen, exitFullscreen } = useFullscreen();
  const { toast } = useToast();

  const toggleFocusMode = useCallback(async () => {
    try {
      if (!isActive) {
        // Activate focus mode
        await enterFullscreen();
        setIsActive(true);
        
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
      toast({
        title: "Focus mode error",
        description: "There was an error with focus mode. Please try again.",
        variant: "destructive"
      });
    }
  }, [isActive, defaultSettings, enterFullscreen, exitFullscreen, toast]);

  return { isActive, toggleFocusMode };
};
