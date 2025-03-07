
import React from 'react';
import { DocumentToolbar } from './DocumentToolbar';
import { ToolbarTools } from './ToolbarTools';
import { ThemeProvider } from '../ThemeProvider';

interface DocumentViewerHeaderProps {
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  hasFile: boolean;
}

export const DocumentViewerHeader: React.FC<DocumentViewerHeaderProps> = ({
  onUpload,
  onDownload,
  onDelete,
  hasFile
}) => {
  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center justify-between gap-2">
        <DocumentToolbar
          onUpload={onUpload}
          onDownload={onDownload}
          onDelete={onDelete}
          hasFile={hasFile}
        />
        <div className="flex items-center gap-2">
          <ToolbarTools />
          <ThemeProvider />
        </div>
      </div>
    </div>
  );
};
