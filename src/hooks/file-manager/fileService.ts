
import { supabase } from '@/integrations/supabase/client';
import { ManagedFile } from './types';

/**
 * Fetches files from Supabase storage
 */
export const fetchFiles = async (): Promise<ManagedFile[]> => {
  try {
    console.log('Fetching files from Supabase storage');
    const { data: storageData, error } = await supabase
      .storage
      .from('files')
      .list();
      
    if (error) {
      console.error('Error fetching files from storage:', error);
      return [];
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
    
    console.log('Loaded files from Supabase:', files.length);
    return files;
  } catch (error) {
    console.error('Error fetching files from Supabase:', error);
    return [];
  }
};

/**
 * Uploads a file to Supabase storage
 */
export const uploadFileToStorage = async (file: File): Promise<ManagedFile | null> => {
  try {
    console.log('Uploading file to Supabase:', file.name);
    
    // Create a unique file path to avoid collisions
    const filePath = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
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
    
    // Create a file object with metadata
    const fileObject: ManagedFile = {
      id: uploadData.path || `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
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
