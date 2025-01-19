import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { FileItem } from "./file-list/FileItem";

interface FileListProps {
  files: File[];
  onFileSelect: (file: File) => void;
  onFileDelete: (file: File) => void;
}

export const FileList = ({ files, onFileSelect, onFileDelete }: FileListProps) => {
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, files.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        onFileSelect(files[index]);
        break;
    }
  };

  if (files.length === 0) {
    return (
      <div 
        className="text-sm text-muted-foreground p-4 text-center"
        role="status"
        aria-label="No files uploaded"
      >
        No files uploaded yet
      </div>
    );
  }

  return (
    <ScrollArea 
      className="h-[200px] w-full rounded-md border p-2"
      role="listbox"
      aria-label="Uploaded files list"
    >
      <div className="space-y-2">
        {files.map((file, index) => (
          <FileItem
            key={`${file.name}-${index}`}
            file={file}
            index={index}
            focusedIndex={focusedIndex}
            onFileSelect={onFileSelect}
            onFileDelete={onFileDelete}
            onFocus={setFocusedIndex}
            handleKeyDown={handleKeyDown}
          />
        ))}
      </div>
    </ScrollArea>
  );
};