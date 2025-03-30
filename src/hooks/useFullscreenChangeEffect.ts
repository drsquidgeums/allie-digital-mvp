
import { useEffect } from "react";
import { useToast } from "./use-toast";

export const useFullscreenChangeEffect = (
  isActive: boolean, 
  onFullscreenExit: (setIsActive: (active: boolean) => void) => void
) => {
  const { toast } = useToast();

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && 
          !(document as any).webkitFullscreenElement && 
          !(document as any).mozFullScreenElement &&
          !(document as any).msFullscreenElement && 
          isActive) {
        
        const setIsActive = (active: boolean) => {
          if (active === false) {
            window.dispatchEvent(new CustomEvent('focusModeChanged', { detail: { active: false } }));
            toast({
              title: "Focus mode deactivated",
              description: "Fullscreen mode was exited",
            });
          }
        };
        
        onFullscreenExit(setIsActive);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isActive, onFullscreenExit, toast]);
};
