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
  const buttonClassName = "h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

  const handleScreenshot = async () => {
    const documentViewer = document.querySelector('[role="document"]');
    if (!documentViewer) return;

    try {
      const canvas = await html2canvas(documentViewer as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true
      });

      // Convert to JPEG and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document-screenshot.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error taking screenshot:', error);
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