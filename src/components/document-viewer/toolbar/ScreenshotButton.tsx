import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ScreenshotButton = () => {
  const { toast } = useToast();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const buttonClassName = "h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

  const startSelection = () => {
    setIsSelecting(true);
    toast({
      title: "Selection mode active",
      description: "Click and drag to select an area to capture",
    });

    // Create selection overlay
    const overlay = document.createElement('div');
    overlay.id = 'screenshot-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
    overlay.style.cursor = 'crosshair';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);

    // Add selection box
    const selectionBox = document.createElement('div');
    selectionBox.id = 'selection-box';
    selectionBox.style.position = 'fixed';
    selectionBox.style.border = '2px dashed #fff';
    selectionBox.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
    selectionBox.style.display = 'none';
    selectionBox.style.zIndex = '10000';
    document.body.appendChild(selectionBox);

    // Mouse events for selection
    overlay.onmousedown = (e) => {
      const startX = e.clientX;
      const startY = e.clientY;
      setStartPos({ x: startX, y: startY });
      selectionBox.style.display = 'block';
      selectionBox.style.left = startX + 'px';
      selectionBox.style.top = startY + 'px';

      overlay.onmousemove = (e) => {
        const currentX = e.clientX;
        const currentY = e.clientY;
        const width = currentX - startX;
        const height = currentY - startY;

        selectionBox.style.width = Math.abs(width) + 'px';
        selectionBox.style.height = Math.abs(height) + 'px';
        selectionBox.style.left = (width < 0 ? currentX : startX) + 'px';
        selectionBox.style.top = (height < 0 ? currentY : startY) + 'px';
      };

      overlay.onmouseup = (e) => {
        const endX = e.clientX;
        const endY = e.clientY;
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        const x = Math.min(startX, endX);
        const y = Math.min(startY, endY);

        setSelection({ x, y, width, height });
        captureScreenshot({ x, y, width, height });
        
        // Clean up
        overlay.onmousemove = null;
        overlay.onmouseup = null;
        document.body.removeChild(overlay);
        document.body.removeChild(selectionBox);
        setIsSelecting(false);
      };
    };
  };

  const captureScreenshot = async (area: { x: number; y: number; width: number; height: number }) => {
    try {
      toast({
        title: "Capturing screenshot",
        description: "Please wait while we process your screenshot...",
      });

      // Wait for any content to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(document.body, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true,
        x: area.x,
        y: area.y,
        width: area.width,
        height: area.height,
        backgroundColor: null,
      });

      // Create a new canvas for the selected area
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = area.width * 2; // Account for scale
      croppedCanvas.height = area.height * 2;
      const ctx = croppedCanvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(canvas, 0, 0);
        
        croppedCanvas.toBlob((blob) => {
          if (!blob) {
            toast({
              title: "Error",
              description: "Failed to create screenshot",
              variant: "destructive",
            });
            return;
          }
          
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'screenshot.jpg';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast({
            title: "Screenshot captured",
            description: "Your screenshot has been downloaded",
          });
        }, 'image/jpeg', 0.9);
      }
    } catch (error) {
      console.error('Error taking screenshot:', error);
      toast({
        title: "Error",
        description: "Failed to capture screenshot",
        variant: "destructive",
      });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={startSelection}
          disabled={isSelecting}
          className={buttonClassName}
          aria-label="Capture screenshot"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom"
        className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
      >
        Capture screenshot
      </TooltipContent>
    </Tooltip>
  );
};