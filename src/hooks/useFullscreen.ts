
import { useState, useCallback, useEffect } from 'react';

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Update state based on document's fullscreen element
  const updateFullscreenState = useCallback(() => {
    const fullscreenElement = 
      document.fullscreenElement || 
      (document as any).webkitFullscreenElement || 
      (document as any).mozFullScreenElement || 
      (document as any).msFullscreenElement;
    
    setIsFullscreen(!!fullscreenElement);
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    document.addEventListener('fullscreenchange', updateFullscreenState);
    document.addEventListener('webkitfullscreenchange', updateFullscreenState);
    document.addEventListener('mozfullscreenchange', updateFullscreenState);
    document.addEventListener('MSFullscreenChange', updateFullscreenState);

    // Check initial state
    updateFullscreenState();

    return () => {
      document.removeEventListener('fullscreenchange', updateFullscreenState);
      document.removeEventListener('webkitfullscreenchange', updateFullscreenState);
      document.removeEventListener('mozfullscreenchange', updateFullscreenState);
      document.removeEventListener('MSFullscreenChange', updateFullscreenState);
    };
  }, [updateFullscreenState]);

  const enterFullscreen = async () => {
    try {
      // If we're already in fullscreen, don't try to enter again
      if (isFullscreen) return true;
      
      const docElm = document.documentElement;
      
      if (docElm.requestFullscreen) {
        await docElm.requestFullscreen();
      } else if ((docElm as any).mozRequestFullScreen) {
        await (docElm as any).mozRequestFullScreen();
      } else if ((docElm as any).webkitRequestFullscreen) {
        await (docElm as any).webkitRequestFullscreen();
      } else if ((docElm as any).msRequestFullscreen) {
        await (docElm as any).msRequestFullscreen();
      }
      
      console.log('Entered fullscreen mode');
      return true;
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      throw error;
    }
  };

  const exitFullscreen = async () => {
    try {
      // If we're not in fullscreen, don't try to exit
      if (!isFullscreen) return true;
      
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
      
      console.log('Exited fullscreen mode');
      return true;
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
      throw error;
    }
  };

  // Wrapper for toggle functionality
  const toggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        return await exitFullscreen();
      } else {
        return await enterFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
      throw error;
    }
  };

  return { isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen };
};
