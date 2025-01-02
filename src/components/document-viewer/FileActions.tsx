import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, Trash2 } from "lucide-react";
import { NotificationCenter } from "../NotificationCenter";

interface FileActionsProps {
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  hasFile: boolean;
}

export const FileActions = ({ onUpload, onDownload, onDelete, hasFile }: FileActionsProps) => {
  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUpload}
          className="bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <Upload className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          disabled={!hasFile}
          className="bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          disabled={!hasFile}
          className="bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <NotificationCenter />
    </div>
  );
};