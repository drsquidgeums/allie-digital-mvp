
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

// Create a singleton instance to share state across components
let globalFiles: ManagedFile[] = [];
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Load saved files from localStorage at initial script execution
(() => {
  try {
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
      globalFiles = JSON.parse(savedFiles);
      console.log('Loaded files from localStorage:', globalFiles.length);
    }
  } catch (error) {
    console.error('Error loading initial files from localStorage:', error);
  }
})();

export function useFileManager() {
  const [files, setFiles] = useState<ManagedFile[]>(globalFiles);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Register component as a listener
  useEffect(() => {
    console.log('useFileManager hook initialized, current global files:', globalFiles.length);
    const listener = () => {
      console.log('Listener triggered, updating local state with global files:', globalFiles.length);
      setFiles([...globalFiles]);
    };
    
    listeners.push(listener);
    
    // Ensure local state is synced with global state on mount
    setFiles([...globalFiles]);
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  // Save files to local storage whenever they change globally
  useEffect(() => {
    const filesToSave = globalFiles.map(({ id, name, size, type, lastModified, url }) => ({
      id, name, size, type, lastModified, url
    }));
    localStorage.setItem('uploadedFiles', JSON.stringify(filesToSave));
    console.log('Files saved to localStorage:', filesToSave.length);
  }, [files]);
  
  const handleFileUpload = async (newFile: File) => {
    setLoading(true);
    try {
      console.log('Uploading file:', newFile.name);
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
      
      // Add to global files state
      globalFiles = [...globalFiles, fileObject];
      console.log('File added to global state, new count:', globalFiles.length);
      notifyListeners();
      setFiles([...globalFiles]);
      
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
      
      // Remove from global files state
      globalFiles = globalFiles.filter(file => file.id !== fileToDelete.id);
      console.log('File deleted from global state, new count:', globalFiles.length);
      notifyListeners();
      setFiles([...globalFiles]);
      
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
