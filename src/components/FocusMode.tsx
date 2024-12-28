import React from "react";
import { Button } from "./ui/button";
import { Focus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const FocusMode = () => {
  const [isActive, setIsActive] = React.useState(false);
  const { toast } = useToast();

  const toggleFocusMode = () => {
    if (!isActive) {
      document.documentElement.requestFullscreen().then(() => {
        setIsActive(true);
        toast({
          title: "Focus mode activated",
          description: "Press ESC to exit focus mode",
        });
      }).catch(() => {
        toast({
          title: "Unable to enter focus mode",
          description: "Fullscreen request was denied",
          variant: "destructive",
        });
      });
    } else {
      document.exitFullscreen();
      setIsActive(false);
      toast({
        title: "Focus mode deactivated",
        description: "Returned to normal view",
      });
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsActive(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="p-4">
      <Button 
        onClick={toggleFocusMode}
        variant={isActive ? "secondary" : "outline"}
        className="w-full"
      >
        <Focus className="w-4 h-4 mr-2" />
        {isActive ? "Exit Focus Mode" : "Enter Focus Mode"}
      </Button>
    </div>
  );
};