import React from "react";
import { Button } from "./ui/button";
import { Glasses } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ColorList } from "./irlen/ColorList";

const colors = [
  { name: "Yellow", value: "rgba(255, 255, 0, 0.3)" },
  { name: "Blue", value: "rgba(0, 0, 255, 0.3)" },
  { name: "Pink", value: "rgba(255, 192, 203, 0.3)" },
  { name: "Purple", value: "rgba(147, 112, 219, 0.3)" },
  { name: "Grey", value: "rgba(128, 128, 128, 0.3)" },
  { name: "Aqua", value: "rgba(0, 255, 255, 0.3)" },
  { name: "Soft Orange", value: "rgba(254, 198, 161, 0.3)" },
  { name: "Bright Orange", value: "rgba(249, 115, 22, 0.3)" },
  { name: "Soft Green", value: "rgba(144, 238, 144, 0.3)" },
  { name: "Bright Green", value: "rgba(0, 255, 0, 0.3)" },
];

export const IrlenOverlay = () => {
  const [overlayColor, setOverlayColor] = React.useState(() => {
    return localStorage.getItem('irlenOverlayColor') || "";
  });
  const { toast } = useToast();

  const handleOverlayChange = (color: string) => {
    setOverlayColor(color);
    localStorage.setItem('irlenOverlayColor', color);
    
    if (color) {
      document.documentElement.style.setProperty('--overlay-color', color);
      document.documentElement.style.setProperty('--overlay-display', 'block');
    } else {
      document.documentElement.style.setProperty('--overlay-display', 'none');
    }
    
    toast({
      title: color ? "Overlay applied" : "Overlay removed",
      description: color ? `Applied ${color} overlay to the workspace` : "Removed overlay from the workspace",
    });
  };

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root::after {
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

    if (overlayColor) {
      document.documentElement.style.setProperty('--overlay-color', overlayColor);
      document.documentElement.style.setProperty('--overlay-display', 'block');
    }

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground"
          title="Irlen Overlay"
        >
          <Glasses className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48" align="end">
        <div className="space-y-2">
          <div className="font-medium text-sm">Irlen Overlay</div>
          <ColorList
            colors={colors}
            selectedColor={overlayColor}
            onColorChange={handleOverlayChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};