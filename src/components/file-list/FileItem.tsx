
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, FileText } from "lucide-react";

export interface FileItemProps {
  file: File;
  index: number;
  focusedIndex: number;
  onFileSelect: (file: File) => void;
  onFileDelete: (file: File) => void;
  onFocus: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent, index: number) => void;
}

export const FileItem = ({
  file,
  index,
  focusedIndex,
  onFileSelect,
  onFileDelete,
  onFocus,
  handleKeyDown,
}: FileItemProps) => {
  return (
    <div
      role="option"
      aria-selected={focusedIndex === index}
      className={`flex justify-between items-center p-2 rounded-md ${
        focusedIndex === index ? "bg-accent" : "hover:bg-accent/50"
      }`}
      tabIndex={0}
      onFocus={() => onFocus(index)}
      onKeyDown={(e) => handleKeyDown(e, index)}
      onClick={() => onFileSelect(file)}
    >
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        <span className="text-sm truncate max-w-[150px]">
          {file.name}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={(e) => {
          e.stopPropagation();
          onFileDelete(file);
        }}
        aria-label={`Delete ${file.name}`}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};
