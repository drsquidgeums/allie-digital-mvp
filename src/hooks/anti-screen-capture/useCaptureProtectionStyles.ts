
export const useCaptureProtectionStyles = (isEnabled: boolean) => {
  if (!isEnabled) return { applyStyles: () => null, removeStyles: () => {} };
  
  const applyStyles = () => {
    // Create style element
    const style = document.createElement('style');
    style.innerHTML = `
      .anti-capture-protection {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      .anti-capture-protection img, 
      .anti-capture-protection video {
        pointer-events: none;
      }
    `;
    
    document.head.appendChild(style);
    document.body.classList.add('anti-capture-protection');
    
    return style;
  };
  
  const removeStyles = (style: HTMLStyleElement | null) => {
    if (style && style.parentNode) {
      document.head.removeChild(style);
    }
    document.body.classList.remove('anti-capture-protection');
  };
  
  return { applyStyles, removeStyles };
};
