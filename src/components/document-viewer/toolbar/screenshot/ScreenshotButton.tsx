
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, ChevronDown, Scan, Monitor } from 'lucide-react';
import { useScreenshot } from './useScreenshot';
import { ScreenshotTooltip } from './ScreenshotTooltip';
import { ScreenshotAnnotator } from './ScreenshotAnnotator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ScreenshotButton = () => {
  const { 
    isSelecting, 
    enableAntiScreenCapture, 
    startSelection, 
    captureFullPage,
    capturedImage,
    showAnnotator,
    downloadImage,
    copyToClipboard,
    closeAnnotator
  } = useScreenshot();
  
  const buttonClassName = "h-9 bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

  return (
    <>
      <ScreenshotTooltip isDisabled={enableAntiScreenCapture}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isSelecting || enableAntiScreenCapture}
              className={`${buttonClassName} ${enableAntiScreenCapture ? "opacity-50" : ""} px-2 gap-1`}
              aria-label={enableAntiScreenCapture ? "Screenshots disabled" : "Capture screenshot"}
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={startSelection} className="gap-2">
              <Scan className="h-4 w-4" />
              Select Area
            </DropdownMenuItem>
            <DropdownMenuItem onClick={captureFullPage} className="gap-2">
              <Monitor className="h-4 w-4" />
              Full Page
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ScreenshotTooltip>

      {showAnnotator && capturedImage && (
        <ScreenshotAnnotator
          imageDataUrl={capturedImage}
          onSave={downloadImage}
          onCopyToClipboard={copyToClipboard}
          onClose={closeAnnotator}
        />
      )}
    </>
  );
};
