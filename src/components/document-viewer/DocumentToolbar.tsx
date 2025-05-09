
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScreenshotButton } from './toolbar/ScreenshotButton';

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
          <TooltipContent side="bottom">
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
          <TooltipContent side="bottom">
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
          <TooltipContent side="bottom">
            Delete document
          </TooltipContent>
        </Tooltip>

        <ScreenshotButton />
      </div>
    </div>
  );
};
