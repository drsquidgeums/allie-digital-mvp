
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
        const nextIndex = Math.min(index + 1, files.length - 1);
        setFocusedIndex(nextIndex);
        // Focus the next file item
        const nextElement = document.querySelector(`[data-file-index="${nextIndex}"]`) as HTMLElement;
        nextElement?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = Math.max(index - 1, 0);
        setFocusedIndex(prevIndex);
        // Focus the previous file item
        const prevElement = document.querySelector(`[data-file-index="${prevIndex}"]`) as HTMLElement;
        prevElement?.focus();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onFileSelect(files[index]);
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        onFileDelete(files[index]);
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
      role="region"
      aria-label="Uploaded files list"
    >
      <div 
        className="space-y-2"
        role="listbox"
        aria-label={`${files.length} uploaded files`}
        aria-describedby="file-list-instructions"
      >
        <div id="file-list-instructions" className="sr-only">
          Use arrow keys to navigate, Enter or Space to select, Delete or Backspace to remove files
        </div>
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="transition-all duration-200 ease-in-out hover:scale-[1.02] focus-within:scale-[1.02]"
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
