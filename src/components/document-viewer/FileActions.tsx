
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, Trash2 } from "lucide-react";
import { NotificationCenter } from "../NotificationCenter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileActionsProps {
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  hasFile: boolean;
}

export const FileActions = ({ onUpload, onDownload, onDelete, hasFile }: FileActionsProps) => {
  const buttonClassName = "h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground";

  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onUpload}
              className={buttonClassName}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Upload document</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              disabled={!hasFile}
              className={buttonClassName}
            >
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Download document</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={!hasFile}
              className={buttonClassName}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Delete document</TooltipContent>
        </Tooltip>
      </div>
      <NotificationCenter />
    </div>
  );
};
