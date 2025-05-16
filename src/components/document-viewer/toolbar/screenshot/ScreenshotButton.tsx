
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useScreenshot } from './useScreenshot';
import { ScreenshotTooltip } from './ScreenshotTooltip';

export const ScreenshotButton = () => {
  const { isSelecting, enableAntiScreenCapture, startSelection } = useScreenshot();
  const buttonClassName = "h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

  return (
    <ScreenshotTooltip isDisabled={enableAntiScreenCapture}>
      <Button
        variant="outline"
        size="sm"
        onClick={startSelection}
        disabled={isSelecting || enableAntiScreenCapture}
        className={`${buttonClassName} ${enableAntiScreenCapture ? "opacity-50" : ""}`}
        aria-label={enableAntiScreenCapture ? "Screenshots disabled" : "Capture screenshot"}
      >
        <Camera className="h-4 w-4" aria-hidden="true" />
      </Button>
    </ScreenshotTooltip>
  );
};
