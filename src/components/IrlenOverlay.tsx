import React from "react";
import { Button } from "./ui/button";
import { Glasses } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const IrlenOverlay = () => {
  const [overlayColor, setOverlayColor] = React.useState("");
  const { toast } = useToast();

  const colors = [
    { name: "Yellow", value: "rgba(255, 255, 0, 0.2)" },
    { name: "Blue", value: "rgba(0, 0, 255, 0.2)" },
    { name: "Green", value: "rgba(0, 255, 0, 0.2)" },
    { name: "Rose", value: "rgba(255, 192, 203, 0.2)" },
  ];

  const handleOverlayChange = (color: string) => {
    setOverlayColor(color);
    document.documentElement.style.setProperty('--overlay-color', color);
    toast({
      title: "Overlay applied",
      description: `Applied ${color} overlay to the workspace`,
    });
  };

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