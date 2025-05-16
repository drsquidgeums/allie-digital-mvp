
import { useToast } from '@/hooks/use-toast';

interface KeyboardDetectionOptions {
  showWarning: () => void;
}

export const useKeyboardDetection = (isEnabled: boolean, options: KeyboardDetectionOptions) => {
  if (!isEnabled) return { handleKeyDown: () => {} };

  const handleKeyDown = (e: KeyboardEvent) => {
    // PrintScreen key (doesn't work in all browsers due to security limitations)
    if (e.key === 'PrintScreen' || e.keyCode === 44) {
      e.preventDefault();
      options.showWarning();
      return false;
    }

    // Detect Ctrl+Shift+S, Ctrl+S, and other common screenshot shortcuts
    if ((e.ctrlKey && e.shiftKey && e.key === 's') ||
        (e.metaKey && e.shiftKey && e.key === '3') || // macOS screenshot shortcut
        (e.metaKey && e.shiftKey && e.key === '4')) { // macOS area screenshot
      e.preventDefault();
      options.showWarning();
      return false;
    }
  };

  return { handleKeyDown };
};
