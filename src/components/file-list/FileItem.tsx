import React from "react";
import { Button } from "../ui/button";
import { FileText, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileItemProps {
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
  const { toast } = useToast();

  const handleDownload = () => {
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

  return (
    <div 
      className="flex items-center gap-2"
      onKeyDown={(e) => handleKeyDown(e, index)}
    >
      <Button
        variant="ghost"
        className={`flex-1 justify-start gap-2 text-sm ${focusedIndex === index ? 'ring-2 ring-primary' : ''}`}
        onClick={() => onFileSelect(file)}
        onFocus={() => onFocus(index)}
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
        onClick={handleDownload}
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
  );
};