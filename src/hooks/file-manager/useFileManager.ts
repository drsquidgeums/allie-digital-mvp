
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
  updateFile,
  registerListener
} from './fileStore';

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
  const handleFileUpload = async (newFile: File, metadata?: Record<string, any>) => {
    setLoading(true);
    try {
      // Upload to Supabase storage
      const fileObject = await uploadFileToStorage(newFile, metadata);
      
      if (fileObject) {
        // Add to global files state
        addFile(fileObject);
        setLocalFiles([...getFiles()]);
        
        toast({
          title: "File uploaded",
          description: `${metadata?.originalName || newFile.name} has been uploaded to Supabase storage`,
        });
        
        return fileObject;
      }
      throw new Error('File upload failed');
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

  /**
   * Updates an existing file in storage
   */
  const handleFileUpdate = async (existingFile: ManagedFile, newContent: File, metadata?: Record<string, any>) => {
    setLoading(true);
    try {
      console.log('Updating file:', existingFile.name, 'with new content');
      
      // Delete the old file first
      if (existingFile.path) {
        await deleteFileFromStorage(existingFile.path);
      }
      
      // Upload the new content, preserving the display name
      const displayName = metadata?.originalName || existingFile.displayName || existingFile.name;
      const updatedFileObject = await uploadFileToStorage(newContent, {
        ...metadata,
        originalName: displayName
      });
      
      if (updatedFileObject) {
        console.log('File updated successfully, new file object:', updatedFileObject);
        
        // Update the file in global state with the same ID but new content
        const updatedFile = {
          ...updatedFileObject,
          id: existingFile.id, // Keep the same ID to maintain references
        };
        
        updateFile(existingFile.id, updatedFile);
        setLocalFiles([...getFiles()]);
        
        toast({
          title: "File updated",
          description: `${displayName} has been updated`,
        });
        
        return updatedFile;
      }
      throw new Error('File update failed');
    } catch (error) {
      console.error("Error updating file:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "There was a problem updating your file",
        variant: "destructive",
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
        description: `${fileToDelete.displayName || fileToDelete.name} has been removed`,
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

  /**
   * Downloads a file from storage
   */
  const handleFileDownload = async (file: ManagedFile) => {
    try {
      // If we already have a URL, use it
      if (file.url) {
        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.displayName || file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast({
          title: "File downloaded",
          description: `${file.displayName || file.name} has been downloaded`,
        });
      } 
      // If the URL has expired, generate a new one
      else if (file.path) {
        const signedUrl = await createDownloadUrl(file.path);
        
        const a = document.createElement("a");
        a.href = signedUrl;
        a.download = file.displayName || file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast({
          title: "File downloaded",
          description: `${file.displayName || file.name} has been downloaded`,
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
      toast({
        title: "Refresh failed",
        description: "There was a problem refreshing your files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize by loading files from Supabase storage if not already loaded
  useEffect(() => {
    if (getFiles().length === 0 && !loading) {
      refreshFiles().catch(console.error);
    }
  }, []);

  return {
    files,
    loading,
    uploadFile: handleFileUpload,
    updateFile: handleFileUpdate,
    deleteFile: handleFileDelete,
    downloadFile: handleFileDownload,
    refreshFiles
  };
}
