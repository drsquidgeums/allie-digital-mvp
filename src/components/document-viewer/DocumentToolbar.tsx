import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2, ZoomIn, ZoomOut } from 'lucide-react';
import { NotificationCenter } from '../NotificationCenter';

interface DocumentToolbarProps {
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  hasFile: boolean;
}

export const DocumentToolbar = ({
  onUpload,
  onDownload,
  onDelete,
  onZoomIn,
  onZoomOut,
  hasFile
}: DocumentToolbarProps) => {
  const buttonClassName = "h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground";

  return (
    <div className="flex justify-between w-full p-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUpload}
          className={buttonClassName}
          title="Upload document"
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          disabled={!hasFile}
          className={buttonClassName}
          title="Download document"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          disabled={!hasFile}
          className={buttonClassName}
          title="Delete document"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        {onZoomIn && onZoomOut && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onZoomIn}
              className={buttonClassName}
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onZoomOut}
              className={buttonClassName}
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <NotificationCenter />
    </div>
  );
};