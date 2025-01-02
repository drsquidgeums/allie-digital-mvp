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
          variant="secondary" 
          size="sm" 
          onClick={onUpload}
          className="dark:hover:bg-gray-800"
        >
          <Upload className="w-4 h-4" />
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onDownload} 
          disabled={!hasFile}
          className="dark:hover:bg-gray-800"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onDelete} 
          disabled={!hasFile}
          className="dark:hover:bg-gray-800"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <NotificationCenter />
    </div>
  );
};