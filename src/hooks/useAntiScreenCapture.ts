
import { useEffect, useRef } from 'react';
import { useWarningToast } from './anti-screen-capture/useWarningToast';
import { useKeyboardDetection } from './anti-screen-capture/useKeyboardDetection';
import { useVisibilityDetection } from './anti-screen-capture/useVisibilityDetection';
import { useContextMenuPrevention } from './anti-screen-capture/useContextMenuPrevention';
import { useCaptureProtectionStyles } from './anti-screen-capture/useCaptureProtectionStyles';
import { useSecurityMeta } from './anti-screen-capture/useSecurityMeta';

export const useAntiScreenCapture = (isEnabled: boolean = true) => {
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const metaRef = useRef<HTMLMetaElement | null>(null);
  
  // Get individual hook functions
  const { showWarning } = useWarningToast();
  const { handleKeyDown } = useKeyboardDetection(isEnabled, { showWarning });
  const { handleVisibilityChange } = useVisibilityDetection(isEnabled, showWarning);
  const { disableContextMenu } = useContextMenuPrevention(isEnabled);
  const { applyStyles, removeStyles } = useCaptureProtectionStyles(isEnabled);
  const { createMeta, removeMeta } = useSecurityMeta(isEnabled);

  useEffect(() => {
    if (!isEnabled) return;

    // Setup all protection mechanisms
    metaRef.current = createMeta();
    styleRef.current = applyStyles();
    
    // Apply event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', disableContextMenu);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', disableContextMenu);
      
      removeMeta(metaRef.current);
      removeStyles(styleRef.current);
    };
  }, [isEnabled, handleKeyDown, handleVisibilityChange, disableContextMenu]);
};
