
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FocusSettings } from "@/hooks/useFocusSettings";

export const useVisibilityEffect = (isActive: boolean, settings: FocusSettings) => {
  const { toast } = useToast();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isActive && document.hidden && settings.blockPopups) {
        toast({
          title: "Stay focused!",
          description: "You've switched away from your focus session",
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, settings.blockPopups, toast]);
};
