
import { useToast } from "./use-toast";
import React from "react";

export const useFullscreen = () => {
  const { toast } = useToast();

  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) { // Safari
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) { // IE11
        await (elem as any).msRequestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) { // Firefox
        await (elem as any).mozRequestFullScreen();
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      toast({
        title: "Fullscreen mode failed",
        description: "Could not enter fullscreen mode. Please check your browser settings.",
        variant: "destructive",
      });
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) { // Safari
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) { // IE11
        await (document as any).msExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) { // Firefox
        await (document as any).mozCancelFullScreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  };

  // Handle fullscreen change events
  React.useEffect(() => {
    const handleFullscreenChange = (callback: (isFullscreen: boolean) => void) => {
      if (!document.fullscreenElement && 
          !(document as any).webkitFullscreenElement && 
          !(document as any).mozFullScreenElement &&
          !(document as any).msFullscreenElement) {
        callback(false);
      }
    };

    return () => {
      // Cleanup is handled by the component that uses this hook
    };
  }, []);

  return { enterFullscreen, exitFullscreen };
};
