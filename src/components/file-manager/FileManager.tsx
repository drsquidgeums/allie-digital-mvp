
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ManagedFile, useFileManager } from '@/hooks/useFileManager';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface FileManagerProps {
  onFileSelect?: (file: ManagedFile) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({ 
  onFileSelect 
}) => {
  const { files, loading, deleteFile, downloadFile, refreshFiles } = useFileManager();
  const { toast } = useToast();

  useEffect(() => {
    console.log("FileManager mounted, files count:", files.length);
  }, []);

  useEffect(() => {
    console.log("FileManager files updated:", files.length);
  }, [files]);

  const handleFileSelect = (file: ManagedFile) => {
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleRefresh = async () => {
    await refreshFiles();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          My Files
        </h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="border rounded-md p-4 bg-card">
        {loading && (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        {!loading && files.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <Button 
                      variant="link" 
                      onClick={() => handleFileSelect(file)}
                      className="p-0 h-auto text-left justify-start font-normal"
                    >
                      {file.name}
                    </Button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {file.type || "Unknown"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatBytes(file.size)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => downloadFile(file)}
                        aria-label={`Download ${file.name}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteFile(file)}
                        aria-label={`Delete ${file.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {!loading && files.length === 0 && (
          <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-md">
            No files uploaded yet. Use the Toolbox to upload files.
          </div>
        )}
      </div>
    </div>
  );
};

// Utility function to format bytes to human-readable format
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
