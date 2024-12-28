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
        // Add blocking overlay
        const style = document.createElement('style');
        style.id = 'focus-mode-style';
        style.textContent = `
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            pointer-events: none;
          }
        `;
        document.head.appendChild(style);
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
      const style = document.getElementById('focus-mode-style');
      if (style) {
        document.head.removeChild(style);
      }
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
        const style = document.getElementById('focus-mode-style');
        if (style) {
          document.head.removeChild(style);
        }
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