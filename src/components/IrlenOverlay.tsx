import React from "react";
import { Button } from "./ui/button";
import { Glasses } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    // Add overlay styles
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
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Glasses className="w-4 h-4" />
        <h3 className="font-medium">Irlen Overlay</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
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
      </div>
      {overlayColor && (
        <Button 
          onClick={() => handleOverlayChange("")}
          variant="outline" 
          className="w-full"
        >
          Remove Overlay
        </Button>
      )}
    </div>
  );
};