import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { FileText } from "lucide-react";

interface FileListProps {
  files: File[];
  onFileSelect: (file: File) => void;
}

export const FileList = ({ files, onFileSelect }: FileListProps) => {
  if (files.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center">
        No files uploaded yet
      </div>
    );
  }

  return (
    <ScrollArea className="h-[200px] w-full rounded-md border p-2">
      <div className="space-y-2">
        {files.map((file, index) => (
          <Button
            key={`${file.name}-${index}`}
            variant="ghost"
            className="w-full justify-start gap-2 text-sm"
            onClick={() => onFileSelect(file)}
          >
            <FileText className="h-4 w-4" />
            <span className="truncate">{file.name}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};