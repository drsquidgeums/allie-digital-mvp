import React from 'react';
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
  const buttonClassName = "h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

  const handleScreenshot = async () => {
    // Get the document content container instead of just the role="document" element
    const documentViewer = document.querySelector('.flex-1.p-4.relative');
    if (!documentViewer) {
      toast({
        title: "Error",
        description: "Could not find document viewer",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Capturing screenshot",
        description: "Please wait while we process your screenshot...",
      });

      // Wait for any content to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(documentViewer as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        foreignObjectRendering: true,
        backgroundColor: '#ffffff',
        width: documentViewer.scrollWidth,
        height: documentViewer.scrollHeight
      });

      canvas.toBlob((blob) => {
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
        link.download = 'document-screenshot.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Screenshot captured",
          description: "Your screenshot has been downloaded",
        });
      }, 'image/jpeg', 0.9);
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
          onClick={handleScreenshot}
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