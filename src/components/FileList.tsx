import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { FileText, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileListProps {
  files: File[];
  onFileSelect: (file: File) => void;
  onFileDelete: (file: File) => void;
}

export const FileList = ({ files, onFileSelect, onFileDelete }: FileListProps) => {
  const { toast } = useToast();
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);

  const handleDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File downloaded",
      description: `${file.name} has been downloaded`,
    });
  };

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
          <div 
            key={`${file.name}-${index}`} 
            className="flex items-center gap-2"
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <Button
              variant="ghost"
              className={`flex-1 justify-start gap-2 text-sm ${focusedIndex === index ? 'ring-2 ring-primary' : ''}`}
              onClick={() => onFileSelect(file)}
              onFocus={() => setFocusedIndex(index)}
              role="option"
              aria-selected={focusedIndex === index}
              tabIndex={0}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span className="truncate">{file.name}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDownload(file)}
              aria-label={`Download ${file.name}`}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onFileDelete(file);
                toast({
                  title: "File deleted",
                  description: `${file.name} has been removed`,
                });
              }}
              aria-label={`Delete ${file.name}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};