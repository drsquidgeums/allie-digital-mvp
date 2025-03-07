
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useScreenshotCapture } from './screenshot/useScreenshotCapture';
import { ScreenshotOverlay } from './screenshot/ScreenshotOverlay';

export const ScreenshotButton = () => {
  const { isSelecting, startSelection, cancelSelection, captureScreenshot } = useScreenshotCapture();
  const buttonClassName = "h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

  return (
    <>
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
      
      {isSelecting && (
        <ScreenshotOverlay 
          onComplete={captureScreenshot}
          onCancel={cancelSelection}
        />
      )}
    </>
  );
};
