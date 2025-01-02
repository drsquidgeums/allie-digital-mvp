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
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Upload className="w-4 h-4 text-gray-600" />
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onDownload} 
          disabled={!hasFile}
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Download className="w-4 h-4 text-gray-600" />
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onDelete} 
          disabled={!hasFile}
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Trash2 className="w-4 h-4 text-gray-600" />
        </Button>
      </div>
      <NotificationCenter />
    </div>
  );
};