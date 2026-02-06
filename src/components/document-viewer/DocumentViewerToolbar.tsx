
import React from "react";
import { DocumentToolbar } from "./DocumentToolbar";
import { ToolbarTools } from "./ToolbarTools";
import { FocusButton } from "../focus/FocusButton";

interface DocumentViewerToolbarProps {
  documentName?: string;
  documentContent?: string;
}

export const DocumentViewerToolbar: React.FC<DocumentViewerToolbarProps> = ({
  documentContent,
  documentName
}) => {
  return (
    <div className="border-b border-border">
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <DocumentToolbar />
          <div className="flex items-center gap-2 ml-auto">
            <div data-tour="focus-mode">
              <FocusButton />
            </div>
            <ToolbarTools 
              documentContent={documentContent}
              documentName={documentName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
