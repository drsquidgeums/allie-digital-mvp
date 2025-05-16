
export const useSecurityMeta = (isEnabled: boolean) => {
  if (!isEnabled) return { createMeta: () => null, removeMeta: () => {} };
  
  const createMeta = () => {
    // Add security warning on page load
    const metaTag = document.createElement('meta');
    metaTag.name = 'httpEquiv';
    metaTag.content = 'Content is protected by NDA. Screenshots and recording prohibited.';
    document.head.appendChild(metaTag);
    
    return metaTag;
  };
  
  const removeMeta = (metaTag: HTMLMetaElement | null) => {
    if (metaTag && metaTag.parentNode) {
      document.head.removeChild(metaTag);
    }
  };
  
  return { createMeta, removeMeta };
};
