
import React from "react";
import { DocumentToolbar } from "./DocumentToolbar";
import { ToolbarTools } from "./ToolbarTools";
import { FocusButton } from "../focus/FocusButton";
import { StudySessionTracker } from "../study/StudySessionTracker";

interface DocumentViewerToolbarProps {
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  hasFile: boolean;
  documentName?: string;
}

export const DocumentViewerToolbar: React.FC<DocumentViewerToolbarProps> = ({
  onUpload,
  onDownload,
  onDelete,
  hasFile,
  documentName
}) => {
  return (
    <div className="border-b border-border">
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <DocumentToolbar
            onUpload={onUpload}
            onDownload={onDownload}
            onDelete={onDelete}
            hasFile={hasFile}
          />
          <div className="flex items-center gap-2 ml-auto">
            <FocusButton />
            <ToolbarTools />
          </div>
        </div>
      </div>
      
      {hasFile && documentName && (
        <div className="px-4 pb-4">
          <StudySessionTracker documentName={documentName} />
        </div>
      )}
    </div>
  );
};
