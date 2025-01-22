import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2, Camera } from 'lucide-react';
import { NotificationCenter } from '../NotificationCenter';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import html2canvas from 'html2canvas';
import { useToast } from "@/hooks/use-toast";

interface DocumentToolbarProps {
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  hasFile: boolean;
}

export const DocumentToolbar = ({
  onUpload,
  onDownload,
  onDelete,
  hasFile
}: DocumentToolbarProps) => {
  const { toast } = useToast();
  const buttonClassName = "h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

  const handleScreenshot = async () => {
    const documentViewer = document.querySelector('.h-full [role="document"]');
    if (!documentViewer) return;

    try {
      toast({
        title: "Capturing screenshot",
        description: "Please wait while we process your screenshot...",
      });

      // Wait for any PDF rendering to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(documentViewer as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true,
        backgroundColor: '#ffffff',
        windowWidth: documentViewer.scrollWidth,
        windowHeight: documentViewer.scrollHeight
      });

      // Convert to JPEG and download
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
    <div 
      className="flex justify-between w-full p-2"
      role="toolbar"
      aria-label="Document actions"
    >
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onUpload}
              className={buttonClassName}
              aria-label="Upload document"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom"
            className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
          >
            Upload document
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              disabled={!hasFile}
              className={buttonClassName}
              aria-label="Download document"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom"
            className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
          >
            Download document
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={!hasFile}
              className={buttonClassName}
              aria-label="Delete document"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom"
            className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
          >
            Delete document
          </TooltipContent>
        </Tooltip>

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
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <NotificationCenter />
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom"
          className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
        >
          Notifications
        </TooltipContent>
      </Tooltip>
    </div>
  );
};