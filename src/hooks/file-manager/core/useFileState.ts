
import { useState, useEffect } from 'react';
import { ManagedFile } from '../types';
import { getFiles, registerListener } from '../fileStore';

/**
 * Hook for managing local file state synchronized with global state
 */
export function useFileState() {
  const [files, setLocalFiles] = useState<ManagedFile[]>(() => getFiles());

  useEffect(() => {
    // Create a cleanup function to remove the listener when component unmounts
    const unregister = registerListener(() => {
      const currentFiles = getFiles();
      setLocalFiles([...currentFiles]);
    });
    
    return unregister;
  }, []); // Remove dependencies to prevent re-registration

  return { files, setLocalFiles };
}
