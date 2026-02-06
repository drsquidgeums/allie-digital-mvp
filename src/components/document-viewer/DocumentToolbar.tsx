
import React from 'react';
import { ScreenshotButton } from './toolbar/screenshot/ScreenshotButton';

export const DocumentToolbar = () => {
  return (
    <div 
      className="flex justify-between w-full p-2"
      role="toolbar"
      aria-label="Document actions"
    >
      <div className="flex gap-2">
        <div data-tour="screenshot">
          <ScreenshotButton />
        </div>
      </div>
    </div>
  );
};
