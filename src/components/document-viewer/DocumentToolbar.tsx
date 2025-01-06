import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2 } from 'lucide-react';
import { NotificationCenter } from '../NotificationCenter';

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
  const buttonClassName = "h-9 w-9 bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-600 hover:border-gray-500";

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
          className={`${buttonClassName} ${!hasFile && 'opacity-50 cursor-not-allowed'}`}
          title="Download document"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          disabled={!hasFile}
          className={`${buttonClassName} ${!hasFile && 'opacity-50 cursor-not-allowed'}`}
          title="Delete document"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <NotificationCenter />
    </div>
  );
};