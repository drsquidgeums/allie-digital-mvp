
export const useVisibilityDetection = (isEnabled: boolean, showWarning: () => void) => {
  if (!isEnabled) return { handleVisibilityChange: () => {} };
  
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      // This might indicate a screenshot being taken in some browsers
      setTimeout(() => {
        if (document.visibilityState === 'visible') {
          showWarning();
        }
      }, 100);
    }
  };

  return { handleVisibilityChange };
};
