
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { FileItem } from "./file-list/FileItem";
import { LoadingSkeleton } from "./ui/loading-skeleton";

interface FileListProps {
  files: File[];
  onFileSelect: (file: File) => void;
  onFileDelete: (file: File) => void;
  isLoading?: boolean;
}

export const FileList = ({ 
  files, 
  onFileSelect, 
  onFileDelete, 
  isLoading = false 
}: FileListProps) => {
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

  // Show loading skeleton when loading
  if (isLoading) {
    return (
      <div className="h-[200px] w-full rounded-md border p-2">
        <LoadingSkeleton 
          type="file-list" 
          count={3}
          className="h-full"
        />
      </div>
    );
  }

  // If there are no files, return null instead of the "No files uploaded yet" message
  if (files.length === 0) {
    return null;
  }

  return (
    <ScrollArea 
      className="h-[200px] w-full rounded-md border p-2 transition-all duration-300 ease-in-out"
      role="listbox"
      aria-label="Uploaded files list"
    >
      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="transition-all duration-200 ease-in-out hover:scale-[1.02]"
          >
            <FileItem
              file={file}
              index={index}
              focusedIndex={focusedIndex}
              onFileSelect={onFileSelect}
              onFileDelete={onFileDelete}
              onFocus={setFocusedIndex}
              handleKeyDown={handleKeyDown}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
