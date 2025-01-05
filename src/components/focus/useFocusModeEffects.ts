import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useFocusModeEffects = (isActive: boolean, settings: any) => {
  const { toast } = useToast();

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isActive && document.hidden) {
        toast({
          title: "Stay focused!",
          description: "You've switched away from your focus session",
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, toast]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isActive && settings.fullscreen) {
        toast({
          title: "Focus mode deactivated",
          description: "Fullscreen mode was exited",
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isActive, settings.fullscreen, toast]);
};