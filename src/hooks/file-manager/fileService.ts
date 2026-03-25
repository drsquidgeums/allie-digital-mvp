
import { supabase } from '@/integrations/supabase/client';
import { ManagedFile } from './types';
import { sanitizeFilename } from '@/utils/sanitize';

/**
 * Gets the current user's ID for folder-based file storage
 */
const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

/**
 * Fetches files from Supabase storage for the current user
 */
export const fetchFiles = async (): Promise<ManagedFile[]> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log('No authenticated user, returning empty file list');
      return [];
    }
    
    console.log('Fetching files from Supabase storage for user:', userId);
    const { data: storageData, error } = await supabase
      .storage
      .from('files')
      .list(userId);
      
    if (error) {
      console.error('Error fetching files from storage:', error);
      return [];
    }
    
    // Convert storage data to ManagedFile format
    const files: ManagedFile[] = await Promise.all(
      storageData.filter(item => !item.id.endsWith('/')).map(async (item) => {
        const filePath = `${userId}/${item.name}`;
        const { data: urlData } = await supabase
          .storage
          .from('files')
          .createSignedUrl(filePath, 60 * 60 * 24); // 24 hours expiry
        
        // Try to extract original name from metadata if it exists
        let displayName = item.name;
        try {
          // Remove timestamp prefix from filename if no metadata is available
          if (item.name.includes('_') && /^\d+_/.test(item.name)) {
            displayName = item.name.replace(/^\d+_/, '');
          }
        } catch (error) {
          console.warn('Could not parse metadata:', error);
        }
        
        return {
          id: item.id,
          name: item.name,
          displayName: displayName.replace(/_/g, ' '), // Replace underscores with spaces
          size: item.metadata?.size || 0,
          type: item.metadata?.mimetype || 'application/octet-stream',
          lastModified: new Date(item.created_at).getTime(),
          url: urlData?.signedUrl,
          path: filePath
        };
      })
    );
    
    console.log('Loaded files from Supabase:', files.length);
    return files;
  } catch (error) {
    console.error('Error fetching files from Supabase:', error);
    return [];
  }
};

/**
 * Uploads a file to Supabase storage in the user's folder
 */
export const uploadFileToStorage = async (file: File, metadata?: Record<string, any>): Promise<ManagedFile | null> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User must be authenticated to upload files');
    }
    
    console.log('Uploading file to Supabase for user:', userId, file.name);
    
    // Create a unique file path within the user's folder
    const safeName = sanitizeFilename(file.name.replace(/\s+/g, '_'));
    const filePath = `${userId}/${Date.now()}_${safeName}`;
    
    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('files')
      .upload(filePath, file);
      
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
    
    // Get display name from metadata or filename
    let displayName = file.name;
    if (metadata?.originalName) {
      displayName = metadata.originalName;
    } else if (file.name.includes('_') && /^\d+_/.test(file.name)) {
      // Remove timestamp prefix from filename if no metadata is available
      displayName = file.name.replace(/^\d+_/, '');
    }
    
    // Create a file object with metadata
    const fileObject: ManagedFile = {
      id: uploadData.path || `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
      displayName: displayName.replace(/_/g, ' '), // Replace underscores with spaces
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      url: urlData.signedUrl,
      path: filePath,
      file: file
    };
    
    return fileObject;
  } catch (error) {
    console.error("Error uploading file:", error);
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
  
  const { error } = await supabase
    .storage
    .from('files')
    .remove([filePath]);
    
  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};

/**
 * Creates a download URL for a file in storage
 */
export const createDownloadUrl = async (filePath: string): Promise<string> => {
  const { data, error } = await supabase
    .storage
    .from('files')
    .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
    
  if (error || !data?.signedUrl) {
    throw new Error('Failed to generate download URL');
  }
  
  return data.signedUrl;
};
