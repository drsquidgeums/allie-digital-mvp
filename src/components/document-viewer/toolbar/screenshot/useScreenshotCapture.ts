
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toPng } from 'html-to-image';

export const useScreenshotCapture = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const { toast } = useToast();
  
  const startSelection = () => {
    setIsSelecting(true);
    toast({
      title: "Selection mode active",
      description: "Click and drag to select an area to capture",
    });
  };
  
  const cancelSelection = () => {
    setIsSelecting(false);
  };
  
  const captureScreenshot = async (area: { x: number; y: number; width: number; height: number }) => {
    try {
      toast({
        title: "Capturing screenshot",
        description: "Please wait while we process your screenshot...",
      });
      
      // Wait a moment for UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const element = document.body;
      const scale = window.devicePixelRatio;
      
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: scale,
        filter: (node) => {
          const element = node as HTMLElement;
          return (
            !element.id?.includes('screenshot-overlay') &&
            !element.id?.includes('selection-box') &&
            !element.classList?.contains('radix-toast')
          );
        },
      });
      
      // Create a canvas to crop the image
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));
      
      const canvas = document.createElement('canvas');
      canvas.width = area.width * scale;
      canvas.height = area.height * scale;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(
          img,
          area.x * scale,
          area.y * scale,
          area.width * scale,
          area.height * scale,
          0,
          0,
          area.width * scale,
          area.height * scale
        );
        
        const croppedDataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = croppedDataUrl;
        link.click();
        
        toast({
          title: "Screenshot captured",
          description: "Your screenshot has been downloaded",
        });
      }
    } catch (error) {
      console.error('Error taking screenshot:', error);
      toast({
        title: "Error",
        description: "Failed to capture screenshot",
        variant: "destructive",
      });
    } finally {
      setIsSelecting(false);
    }
  };
  
  return {
    isSelecting,
    startSelection,
    cancelSelection,
    captureScreenshot,
  };
};
