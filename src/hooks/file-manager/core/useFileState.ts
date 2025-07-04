
import { useState, useEffect } from 'react';
import { ManagedFile } from '../types';
import { getFiles, registerListener } from '../fileStore';

/**
 * Hook for managing local file state synchronized with global state
 */
export function useFileState() {
  const [files, setLocalFiles] = useState<ManagedFile[]>(getFiles());

  useEffect(() => {
    console.log('useFileState hook initialized, current global files:', getFiles().length);
    
    // Create a cleanup function to remove the listener when component unmounts
    const unregister = registerListener(() => {
      console.log('Listener triggered, updating local state with global files:', getFiles().length);
      setLocalFiles([...getFiles()]);
    });
    
    // Ensure local state is synced with global state on mount
    setLocalFiles([...getFiles()]);
    
    return unregister;
  }, []);

  return { files, setLocalFiles };
}
