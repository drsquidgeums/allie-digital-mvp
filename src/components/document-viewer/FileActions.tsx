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
          size="icon"
          onClick={onUpload}
          className="bg-white/50 backdrop-blur-sm"
        >
          <Upload className="h-4 w-4 text-gray-500" />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          onClick={onDownload} 
          disabled={!hasFile}
          className="bg-white/50 backdrop-blur-sm"
        >
          <Download className="h-4 w-4 text-gray-500" />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          onClick={onDelete} 
          disabled={!hasFile}
          className="bg-white/50 backdrop-blur-sm"
        >
          <Trash2 className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
      <NotificationCenter />
    </div>
  );
};