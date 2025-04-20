
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ManagedFile } from './types';
import { 
  fetchFiles, 
  uploadFileToStorage, 
  deleteFileFromStorage,
  createDownloadUrl
} from './fileService';
import {
  getFiles,
  setFiles,
  addFile,
  removeFile,
  registerListener
} from './fileStore';
import { handleError } from '@/utils/errorHandling';

/**
 * Hook for managing file operations across the application
 */
export function useFileManager() {
  const [files, setLocalFiles] = useState<ManagedFile[]>(getFiles());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Register component as a listener for global file state changes
  useEffect(() => {
    console.log('useFileManager hook initialized, current global files:', getFiles().length);
    
    // Create a cleanup function to remove the listener when component unmounts
    const unregister = registerListener(() => {
      console.log('Listener triggered, updating local state with global files:', getFiles().length);
      setLocalFiles([...getFiles()]);
    });
    
    // Ensure local state is synced with global state on mount
    setLocalFiles([...getFiles()]);
    
    // If no files are loaded yet, initialize them
    if (getFiles().length === 0) {
      refreshFiles();
    }
    
    return unregister;
  }, []);
  
  /**
   * Uploads a file to storage and adds it to global state
   */
  const handleFileUpload = async (newFile: File) => {
    setLoading(true);
    try {
      // Upload to Supabase storage
      const fileObject = await uploadFileToStorage(newFile);
      
      if (fileObject) {
        // Add to global files state
        addFile(fileObject);
        setLocalFiles([...getFiles()]);
        
        toast({
          title: "File uploaded",
          description: `${newFile.name} has been uploaded to Supabase storage`,
        });
        
        return fileObject;
      }
      throw new Error('File upload failed');
    } catch (error) {
      handleError(error, {
        title: "Upload failed",
        fallbackMessage: "There was a problem uploading your file"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes a file from storage and removes it from global state
   */
  const handleFileDelete = async (fileToDelete: ManagedFile) => {
    try {
      if (fileToDelete.path) {
        // Delete from Supabase storage
        await deleteFileFromStorage(fileToDelete.path);
      }
      
      // Remove from global files state
      removeFile(fileToDelete.id);
      setLocalFiles([...getFiles()]);
      
      toast({
        title: "File deleted",
        description: `${fileToDelete.name} has been removed`,
      });
    } catch (error) {
      handleError(error, {
        title: "Delete failed",
        fallbackMessage: "There was a problem deleting your file"
      });
    }
  };

  /**
   * Downloads a file from storage
   */
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
        const signedUrl = await createDownloadUrl(file.path);
        
        const a = document.createElement("a");
        a.href = signedUrl;
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
      handleError(error, {
        title: "Download failed",
        fallbackMessage: "There was a problem downloading your file"
      });
    }
  };

  /**
   * Refreshes files from Supabase storage
   */
  const refreshFiles = async () => {
    setLoading(true);
    try {
      const freshFiles = await fetchFiles();
      setFiles(freshFiles);
      setLocalFiles([...freshFiles]);
    } catch (error) {
      handleError(error, {
        title: "Refresh failed",
        fallbackMessage: "There was a problem refreshing your files"
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
