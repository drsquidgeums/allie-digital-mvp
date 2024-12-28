import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, Trash2 } from "lucide-react";

interface FileActionsProps {
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  hasFile: boolean;
}

export const FileActions = ({ onUpload, onDownload, onDelete, hasFile }: FileActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onUpload}>
        <Upload className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onDownload} disabled={!hasFile}>
        <Download className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onDelete} disabled={!hasFile}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};