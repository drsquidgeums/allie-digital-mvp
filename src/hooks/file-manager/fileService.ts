
import { supabase } from '@/integrations/supabase/client';
import { ManagedFile } from './types';

/**
 * Generates a unique file path to avoid collisions (only for new files)
 */
const generateUniqueFilePath = (originalName: string): string => {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${timestamp}_${randomSuffix}_${cleanName}`;
};

/**
 * Extracts display name from file path or uses original name
 */
const extractDisplayName = (filePath: string, originalName?: string): string => {
  if (originalName) {
    return originalName.replace(/\.(html|txt|doc|docx)$/i, '');
  }
  
  // Try to extract original name from the file path format: timestamp_random_originalname
  const parts = filePath.split('_');
  if (parts.length >= 3) {
    // Join everything after the first two parts (timestamp and random)
    const originalNameWithExt = parts.slice(2).join('_');
    // Remove file extension for display
    return originalNameWithExt.replace(/\.(html|txt|doc|docx)$/i, '');
  }
  
  return filePath.replace(/\.(html|txt|doc|docx)$/i, '');
};

/**
 * Fetches files from Supabase storage
 */
export const fetchFiles = async (): Promise<ManagedFile[]> => {
  try {
    console.log('Fetching files from Supabase storage');
    const { data: storageData, error } = await supabase
      .storage
      .from('files')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });
      
    if (error) {
      console.error('Error fetching files from storage:', error);
      throw new Error(`Failed to fetch files: ${error.message}`);
    }
    
    if (!storageData) {
      console.log('No files found in storage');
      return [];
    }
    
    // Filter out directories and convert storage data to ManagedFile format
    const files: ManagedFile[] = await Promise.all(
      storageData
        .filter(item => item.name && !item.id?.endsWith('/'))
        .map(async (item) => {
          try {
            const { data: urlData } = await supabase
              .storage
              .from('files')
              .createSignedUrl(item.name, 60 * 60 * 24); // 24 hours expiry
            
            const displayName = extractDisplayName(item.name);
            
            return {
              id: item.id || `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              name: item.name, // Keep the storage path as name
              displayName: displayName, // User-friendly display name
              size: item.metadata?.size || 0,
              type: item.metadata?.mimetype || 'application/octet-stream',
              lastModified: new Date(item.created_at || Date.now()).getTime(),
              url: urlData?.signedUrl,
              path: item.name
            } as ManagedFile;
          } catch (urlError) {
            console.warn(`Failed to create signed URL for ${item.name}:`, urlError);
            
            const displayName = extractDisplayName(item.name);
            
            return {
              id: item.id || `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              name: item.name,
              displayName: displayName,
              size: item.metadata?.size || 0,
              type: item.metadata?.mimetype || 'application/octet-stream',
              lastModified: new Date(item.created_at || Date.now()).getTime(),
              path: item.name
            } as ManagedFile;
          }
        })
    );
    
    console.log('Loaded files from Supabase:', files.length);
    return files.filter(Boolean); // Remove any null/undefined entries
  } catch (error) {
    console.error('Error fetching files from Supabase:', error);
    throw error;
  }
};

/**
 * Uploads a file to Supabase storage
 */
export const uploadFileToStorage = async (file: File, metadata?: Record<string, any>): Promise<ManagedFile | null> => {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  try {
    console.log('Uploading file to Supabase:', file.name);
    
    // Use the original filename or metadata name for the storage path
    const originalName = metadata?.originalName || file.name;
    
    // For new files, generate unique path to avoid collisions
    // For existing files being updated, this should be handled in updateFile
    const filePath = generateUniqueFilePath(originalName);
    
    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    
    if (!uploadData?.path) {
      throw new Error('Upload succeeded but no path was returned');
    }
    
    // Get the URL for the uploaded file
    const { data: urlData } = await supabase
      .storage
      .from('files')
      .createSignedUrl(uploadData.path, 60 * 60 * 24); // 24 hour expiry
      
    // Create a file object with proper display name
    const displayName = metadata?.originalName || originalName.replace(/\.(html|txt|doc|docx)$/i, '');
    
    const fileObject: ManagedFile = {
      id: uploadData.path || `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: uploadData.path, // Storage path
      displayName: displayName, // Clean display name
      size: file.size,
      type: file.type || 'application/octet-stream',
      lastModified: Date.now(),
      url: urlData?.signedUrl,
      path: uploadData.path,
      file: file
    };
    
    console.log('File uploaded successfully:', displayName);
    return fileObject;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

/**
 * Updates an existing file in storage while preserving the filename
 */
export const updateFileInStorage = async (existingFile: ManagedFile, newContent: File, metadata?: Record<string, any>): Promise<ManagedFile | null> => {
  if (!existingFile?.path || !newContent) {
    throw new Error('Missing required parameters for file update');
  }

  try {
    console.log('Updating existing file in storage:', existingFile.displayName || existingFile.name);
    
    // Use the existing file path to maintain consistency
    const filePath = existingFile.path;
    
    // Update the file content using upsert to overwrite
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('files')
      .upload(filePath, newContent, {
        cacheControl: '3600',
        upsert: true // This will overwrite the existing file
      });
      
    if (uploadError) {
      throw new Error(`Update failed: ${uploadError.message}`);
    }
    
    // Get the URL for the updated file
    const { data: urlData } = await supabase
      .storage
      .from('files')
      .createSignedUrl(filePath, 60 * 60 * 24); // 24 hour expiry
      
    // Preserve the original display name and other metadata
    const displayName = existingFile.displayName || metadata?.originalName || extractDisplayName(filePath);
    
    const updatedFileObject: ManagedFile = {
      id: existingFile.id, // Keep the same ID
      name: filePath, // Keep the same storage path
      displayName: displayName, // Preserve display name
      size: newContent.size,
      type: newContent.type || existingFile.type,
      lastModified: Date.now(),
      url: urlData?.signedUrl,
      path: filePath,
      file: newContent
    };
    
    console.log('File updated successfully, preserved filename:', displayName);
    return updatedFileObject;
  } catch (error) {
    console.error("Error updating file in storage:", error);
    throw error;
  }
};

/**
 * Deletes a file from Supabase storage
 */
export const deleteFileFromStorage = async (filePath: string): Promise<void> => {
  if (!filePath) {
    throw new Error('No file path provided for deletion');
  }
  
  try {
    const { error } = await supabase
      .storage
      .from('files')
      .remove([filePath]);
      
    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
    
    console.log('File deleted successfully:', filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Creates a download URL for a file in storage
 */
export const createDownloadUrl = async (filePath: string): Promise<string> => {
  if (!filePath) {
    throw new Error('No file path provided for download URL creation');
  }

  try {
    const { data, error } = await supabase
      .storage
      .from('files')
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
      
    if (error || !data?.signedUrl) {
      throw new Error(`Failed to generate download URL: ${error?.message || 'No URL returned'}`);
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error creating download URL:', error);
    throw error;
  }
};
