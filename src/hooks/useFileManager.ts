
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { useToast } from './use-toast';

export interface ManagedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  url?: string;
  file?: File;
}

export function useFileManager() {
  const [files, setFiles] = useState<ManagedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Load files from local storage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
      try {
        setFiles(JSON.parse(savedFiles));
      } catch (error) {
        console.error('Error loading saved files:', error);
      }
    }
  }, []);

  // Save files to local storage whenever they change
  useEffect(() => {
    const filesToSave = files.map(({ id, name, size, type, lastModified, url }) => ({
      id, name, size, type, lastModified, url
    }));
    localStorage.setItem('uploadedFiles', JSON.stringify(filesToSave));
  }, [files]);
  
  const handleFileUpload = async (newFile: File) => {
    setLoading(true);
    try {
      // Create a file object with metadata
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Create a URL for the file for client-side access
      const url = URL.createObjectURL(newFile);
      
      const fileObject: ManagedFile = {
        id: fileId,
        name: newFile.name,
        size: newFile.size,
        type: newFile.type,
        lastModified: newFile.lastModified,
        url,
        file: newFile
      };
      
      // Add to files state
      setFiles(prev => [...prev, fileObject]);
      
      toast({
        title: "File uploaded",
        description: `${newFile.name} has been added to your files`,
      });
      
      return fileObject;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your file",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleFileDelete = (fileToDelete: ManagedFile) => {
    try {
      // Revoke URL to prevent memory leaks
      if (fileToDelete.url && fileToDelete.url.startsWith('blob:')) {
        URL.revokeObjectURL(fileToDelete.url);
      }
      
      // Remove from files state
      setFiles(prev => prev.filter(file => file.id !== fileToDelete.id));
      
      toast({
        title: "File deleted",
        description: `${fileToDelete.name} has been removed`,
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Delete failed",
        description: "There was a problem deleting your file",
        variant: "destructive",
      });
    }
  };

  const handleFileDownload = (file: ManagedFile) => {
    try {
      if (file.url) {
        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast({
          title: "File downloaded",
          description: `${file.name} has been downloaded`,
        });
      } else {
        throw new Error("File URL not available");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download failed",
        description: "There was a problem downloading your file",
        variant: "destructive",
      });
    }
  };

  return {
    files,
    loading,
    uploadFile: handleFileUpload,
    deleteFile: handleFileDelete,
    downloadFile: handleFileDownload
  };
}
