
import { useCallback } from 'react';

export const useFullscreen = () => {
  const enterFullscreen = useCallback(async () => {
    try {
      const docEl = document.documentElement;

      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if ((docEl as any).webkitRequestFullscreen) {
        await (docEl as any).webkitRequestFullscreen();
      } else if ((docEl as any).mozRequestFullScreen) {
        await (docEl as any).mozRequestFullScreen();
      } else if ((docEl as any).msRequestFullscreen) {
        await (docEl as any).msRequestFullscreen();
      }
      
      return true;
    } catch (error) {
      console.error('Error entering fullscreen', error);
      return false;
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
      
      return true;
    } catch (error) {
      console.error('Error exiting fullscreen', error);
      return false;
    }
  }, []);

  return { enterFullscreen, exitFullscreen };
};
