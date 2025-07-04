
import React from "react";
import { DocumentToolbar } from "./DocumentToolbar";
import { ToolbarTools } from "./ToolbarTools";
import { ThemeToggle } from "../ThemeToggle";
import { FocusButton } from "../focus/FocusButton";
import { FeedbackButton } from "../community/FeedbackButton";
import { useFeedbackPrompt } from "@/hooks/useFeedbackPrompt";

interface DocumentViewerToolbarProps {
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  hasFile: boolean;
}

export const DocumentViewerToolbar: React.FC<DocumentViewerToolbarProps> = ({
  onUpload,
  onDownload,
  onDelete,
  hasFile
}) => {
  const { handleManualFeedbackOpen } = useFeedbackPrompt();

  return (
    <div className="p-4 border-b border-border">
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
          <FeedbackButton onClick={handleManualFeedbackOpen} />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};
