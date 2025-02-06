
import React from "react";
import { Button } from "./ui/button";
import { Glasses } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColorList } from "./irlen/ColorList";
import { IRLEN_COLORS } from "./irlen/constants";

export const IrlenOverlay = () => {
  const [overlayColor, setOverlayColor] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('irlenOverlayColor') || "";
    }
    return "";
  });
  const { toast } = useToast();

  const handleOverlayChange = (color: string) => {
    setOverlayColor(color);
    localStorage.setItem('irlenOverlayColor', color);
    
    const overlay = document.createElement('div');
    overlay.id = 'irlen-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';
    overlay.style.backgroundColor = color;
    
    // Remove existing overlay if any
    const existingOverlay = document.getElementById('irlen-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    
    // Add new overlay if color is selected
    if (color) {
      document.body.appendChild(overlay);
    }
    
    toast({
      title: color ? "Overlay applied" : "Overlay removed",
      description: color ? `Applied ${IRLEN_COLORS.find(c => c.value === color)?.name || ''} overlay to improve readability` : "Removed overlay from the workspace",
    });
  };

  // Apply overlay on mount if there's a saved color
  React.useEffect(() => {
    if (overlayColor) {
      handleOverlayChange(overlayColor);
    }
  }, []);

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className={`h-9 w-9 relative bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  overlayColor ? "bg-primary text-primary-foreground ring-2 ring-primary" : ""
                }`}
              >
                <Glasses className="h-4 w-4" />
                {overlayColor && (
                  <div 
                    className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                    role="status"
                    aria-label="Overlay active"
                  />
                )}
              </Button>
            </div>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom"
          className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
        >
          Irlen Overlay
        </TooltipContent>
      </Tooltip>
      <PopoverContent 
        className="w-48 bg-popover text-popover-foreground border-border dark:bg-workspace-dark dark:border dark:border-white/20 dark:text-[#FAFAFA]" 
        align="end"
      >
        <div className="space-y-2">
          <div className="font-medium text-sm mb-2">Irlen Overlay</div>
          <ColorList
            colors={IRLEN_COLORS}
            selectedColor={overlayColor}
            onColorChange={handleOverlayChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
