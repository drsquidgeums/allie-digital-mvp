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
          <div key={`${file.name}-${index}`} className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="flex-1 justify-start gap-2 text-sm"
              onClick={() => onFileSelect(file)}
            >
              <FileText className="h-4 w-4" />
              <span className="truncate">{file.name}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDownload(file)}
              title="Download file"
            >
              <Download className="h-4 w-4" />
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
              title="Delete file"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};