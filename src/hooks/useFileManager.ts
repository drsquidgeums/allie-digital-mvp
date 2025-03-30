
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface ManagedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  url?: string;
  file?: File;
  path?: string; // Path in Supabase storage
}

// Create a singleton instance to share state across components
let globalFiles: ManagedFile[] = [];
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Initialize by loading files from Supabase storage
const initializeFiles = async () => {
  try {
    console.log('Initializing files from Supabase storage');
    const { data: storageData, error } = await supabase
      .storage
      .from('files')
      .list();
      
    if (error) {
      console.error('Error fetching files from storage:', error);
      return;
    }
    
    // Convert storage data to ManagedFile format
    const files: ManagedFile[] = await Promise.all(
      storageData.filter(item => !item.id.endsWith('/')).map(async (item) => {
        const { data: urlData } = await supabase
          .storage
          .from('files')
          .createSignedUrl(item.name, 60 * 60 * 24); // 24 hours expiry
        
        return {
          id: item.id,
          name: item.name,
          size: item.metadata?.size || 0,
          type: item.metadata?.mimetype || 'application/octet-stream',
          lastModified: new Date(item.created_at).getTime(),
          url: urlData?.signedUrl,
          path: item.name
        };
      })
    );
    
    globalFiles = files;
    console.log('Loaded files from Supabase:', globalFiles.length);
    notifyListeners();
  } catch (error) {
    console.error('Error initializing files from Supabase:', error);
  }
};

// Initialize by loading files from Supabase storage
initializeFiles();

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
  
  const handleFileUpload = async (newFile: File) => {
    setLoading(true);
    try {
      console.log('Uploading file to Supabase:', newFile.name);
      
      // Create a unique file path to avoid collisions
      const filePath = `${Date.now()}_${newFile.name.replace(/\s+/g, '_')}`;
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('files')
        .upload(filePath, newFile);
        
      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      // Get the URL for the uploaded file
      const { data: urlData } = await supabase
        .storage
        .from('files')
        .createSignedUrl(filePath, 60 * 60 * 24); // 24 hour expiry
        
      if (!urlData?.signedUrl) {
        throw new Error('Failed to generate signed URL');
      }
      
      // Create a file object with metadata
      const fileObject: ManagedFile = {
        id: uploadData.path || `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name: newFile.name,
        size: newFile.size,
        type: newFile.type,
        lastModified: newFile.lastModified,
        url: urlData.signedUrl,
        path: filePath,
        file: newFile
      };
      
      // Add to global files state
      globalFiles = [...globalFiles, fileObject];
      console.log('File added to global state, new count:', globalFiles.length);
      notifyListeners();
      setFiles([...globalFiles]);
      
      toast({
        title: "File uploaded",
        description: `${newFile.name} has been uploaded to Supabase storage`,
      });
      
      return fileObject;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was a problem uploading your file",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleFileDelete = async (fileToDelete: ManagedFile) => {
    try {
      if (fileToDelete.path) {
        // Delete from Supabase storage
        const { error } = await supabase
          .storage
          .from('files')
          .remove([fileToDelete.path]);
          
        if (error) {
          throw new Error(`Delete failed: ${error.message}`);
        }
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
        description: error instanceof Error ? error.message : "There was a problem deleting your file",
        variant: "destructive",
      });
    }
  };

  const handleFileDownload = async (file: ManagedFile) => {
    try {
      // If we already have a URL, use it
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
      } 
      // If the URL has expired, generate a new one
      else if (file.path) {
        const { data, error } = await supabase
          .storage
          .from('files')
          .createSignedUrl(file.path, 60 * 60); // 1 hour expiry
          
        if (error || !data?.signedUrl) {
          throw new Error('Failed to generate download URL');
        }
        
        const a = document.createElement("a");
        a.href = data.signedUrl;
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
        description: error instanceof Error ? error.message : "There was a problem downloading your file",
        variant: "destructive",
      });
    }
  };

  // Refresh files from Supabase storage
  const refreshFiles = async () => {
    setLoading(true);
    try {
      await initializeFiles();
      toast({
        title: "Files refreshed",
        description: "Your files have been refreshed from storage",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "There was a problem refreshing your files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    files,
    loading,
    uploadFile: handleFileUpload,
    deleteFile: handleFileDelete,
    downloadFile: handleFileDownload,
    refreshFiles
  };
}
