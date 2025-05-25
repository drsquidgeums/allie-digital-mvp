
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText, Trash2, Upload, FolderOpen } from 'lucide-react';
import { useFileManager } from '@/hooks/file-manager';
import { ManagedFile } from '@/hooks/file-manager/types';
import { formatBytes, getDisplayName } from '@/utils/fileUtils';
import { useNavigate } from 'react-router-dom';

/**
 * Component that displays and manages files
 */
export const FileManager: React.FC = () => {
  const { files, loading, uploadFile, deleteFile, downloadFile } = useFileManager();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Log files when component mounts or files change
  useEffect(() => {
    console.log('FileManager files updated:', files.length);
  }, [files]);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await uploadFile(selectedFile);
      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Handle opening a file in the workspace
  const openInWorkspace = (file: ManagedFile) => {
    // Get the clean display name without timestamp
    const cleanName = file.displayName || getDisplayName(file.name);
    console.log('Opening file in workspace:', cleanName);
    
    // Store the file ID and URL in sessionStorage to be picked up by the main workspace
    sessionStorage.setItem('selectedFileId', file.id);
    if (file.url) {
      sessionStorage.setItem('selectedFileUrl', file.url);
    }
    
    // Use a generic display name if the clean name still has numbers
    const displayName = cleanName.match(/^\d/) ? 'My File' : cleanName;
    sessionStorage.setItem('selectedFileName', displayName);
    
    // Navigate to the home page (workspace)
    navigate('/');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Files</h1>
        <div>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {!loading && files.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No files found</h3>
          <p className="text-muted-foreground">Upload files to see them here.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map(file => {
                const displayName = file.displayName || getDisplayName(file.name);
                const cleanDisplayName = displayName.match(/^\d/) ? 'My File' : displayName;
                
                return (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">{cleanDisplayName}</TableCell>
                    <TableCell>{file.type}</TableCell>
                    <TableCell>{formatBytes(file.size)}</TableCell>
                    <TableCell>{formatDate(file.lastModified)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openInWorkspace(file)}
                          aria-label="Open in workspace"
                          title="Open in workspace"
                        >
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => downloadFile(file)}
                          aria-label="Download file"
                          title="Download file"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFile(file)}
                          aria-label="Delete file"
                          title="Delete file"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
