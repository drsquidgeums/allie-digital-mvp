
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

export const ScreenshotButton: React.FC = () => {
  const { toast } = useToast();
  
  const captureScreenshot = async () => {
    const documentElement = document.querySelector("#document-viewer-content");
    
    if (!documentElement) {
      toast({
        title: "Screenshot Error",
        description: "Could not find document content to capture",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Capturing Screenshot",
        description: "Please wait while your screenshot is prepared...",
      });
      
      const canvas = await html2canvas(documentElement as HTMLElement, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        allowTaint: true
      });
      
      // Convert to image and trigger download
      const link = document.createElement("a");
      link.download = `document-screenshot-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast({
        title: "Screenshot Captured",
        description: "Your screenshot has been downloaded",
      });
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      toast({
        title: "Screenshot Failed",
        description: "There was a problem capturing the screenshot",
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
          onClick={captureScreenshot}
          className="h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground"
          aria-label="Capture screenshot"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        Capture screenshot
      </TooltipContent>
    </Tooltip>
  );
};
