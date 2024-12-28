import React from "react";
import { Button } from "./ui/button";
import { Glasses } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const IrlenOverlay = () => {
  const [overlayColor, setOverlayColor] = React.useState("");
  const { toast } = useToast();

  const colors = [
    { name: "Yellow", value: "rgba(255, 255, 0, 0.3)" },
    { name: "Blue", value: "rgba(0, 0, 255, 0.3)" },
    { name: "Rose", value: "rgba(255, 192, 203, 0.3)" }
  ];

  const handleOverlayChange = (color: string) => {
    setOverlayColor(color);
    if (color) {
      document.body.style.position = 'relative';
      document.body.style.setProperty('--overlay-color', color);
      document.body.style.setProperty('--overlay-display', 'block');
    } else {
      document.body.style.setProperty('--overlay-display', 'none');
    }
    
    toast({
      title: color ? "Overlay applied" : "Overlay removed",
      description: color ? `Applied ${color} overlay to the workspace` : "Removed overlay from the workspace",
    });
  };

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      body::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--overlay-color);
        pointer-events: none;
        z-index: 9999;
        display: var(--overlay-display, none);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`${overlayColor ? 'bg-secondary' : ''} bg-white/50 backdrop-blur-sm`}
        >
          <Glasses className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48" align="end">
        <div className="space-y-2">
          <div className="font-medium text-sm">Irlen Overlay</div>
          <div className="grid grid-cols-1 gap-2">
            {colors.map((color) => (
              <Button
                key={color.name}
                onClick={() => handleOverlayChange(color.value)}
                className="w-full"
                variant={overlayColor === color.value ? "secondary" : "outline"}
              >
                {color.name}
              </Button>
            ))}
            <Button 
              onClick={() => handleOverlayChange("")}
              variant="outline" 
              className="w-full"
              disabled={!overlayColor}
            >
              Remove Overlay
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};