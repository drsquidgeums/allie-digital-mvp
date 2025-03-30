
import React from "react";
import { FileList } from "./FileList";
import { FileText, Upload } from "lucide-react";
import { Button } from "./ui/button";

interface MyFilesProps {
  files: File[];
  onFileSelect: (file: File) => void;
  onFileDelete: (file: File) => void;
  onUploadClick: () => void;
}

export const MyFiles: React.FC<MyFilesProps> = ({
  files,
  onFileSelect,
  onFileDelete,
  onUploadClick
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <FileText className="h-5 w-5" />
          My Files
        </h2>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onUploadClick}
          className="flex items-center gap-1"
        >
          <Upload className="h-4 w-4" />
          <span>Upload</span>
        </Button>
      </div>
      
      <FileList 
        files={files} 
        onFileSelect={onFileSelect}
        onFileDelete={onFileDelete}
      />

      {files.length === 0 && (
        <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-md">
          No files uploaded yet. Click Upload to add files.
        </div>
      )}
    </div>
  );
};
