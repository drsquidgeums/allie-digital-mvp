
export const getUrlType = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase() || '';
  if (extension === 'pdf') return 'pdf';
  if (extension === 'txt') return 'txt';
  if (extension === 'html' || extension === 'htm') return 'html';
  if (isVideoUrl(url)) return 'video';
  if (isGoogleDocsUrl(url)) return 'google-docs';
  return 'webpage';
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const isVideoUrl = (url: string): boolean => {
  // Convert URL to lowercase for case-insensitive matching
  const lowercaseUrl = url.toLowerCase();
  
  // YouTube URLs
  if (lowercaseUrl.includes('youtube.com/watch') || 
      lowercaseUrl.includes('youtu.be/')) {
    // Convert YouTube URLs to embed format
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      return true;
    }
  }

  // Vimeo URLs
  if (lowercaseUrl.includes('vimeo.com/')) {
    return true;
  }

  // Add more video platforms as needed
  return false;
};

export const getEmbedUrl = (url: string): string => {
  const lowercaseUrl = url.toLowerCase();
  
  // YouTube
  if (lowercaseUrl.includes('youtube.com/watch') || 
      lowercaseUrl.includes('youtu.be/')) {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // Vimeo
  if (lowercaseUrl.includes('vimeo.com/')) {
    const vimeoId = url.split('/').pop();
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
  }

  // Google Docs
  if (isGoogleDocsUrl(url)) {
    return convertToEmbeddableGoogleUrl(url);
  }

  return url;
};

export const isGoogleDocsUrl = (url: string): boolean => {
  const lowercaseUrl = url.toLowerCase();
  return (
    lowercaseUrl.includes('docs.google.com/document') ||
    lowercaseUrl.includes('docs.google.com/spreadsheets') ||
    lowercaseUrl.includes('docs.google.com/presentation')
  );
};

export const convertToEmbeddableGoogleUrl = (url: string): string => {
  const lowercaseUrl = url.toLowerCase();
  
  // Google Docs - use embeddedfolderview for editing
  if (lowercaseUrl.includes('docs.google.com/document')) {
    // If it's already in edit mode, keep it that way
    if (url.includes('/edit')) {
      return url;
    } else {
      // Otherwise convert to edit mode
      return url.replace(/\/preview(?:[^\/]*)?(?=#|$)/, '/edit')
                .replace(/\/pub(?:[^\/]*)?(?=#|$)/, '/edit');
    }
  }
  
  // Google Sheets
  if (lowercaseUrl.includes('docs.google.com/spreadsheets')) {
    if (url.includes('/edit')) {
      return url;
    } else {
      return url.replace(/\/preview(?:[^\/]*)?(?=#|$)/, '/edit')
                .replace(/\/pubhtml(?:[^\/]*)?(?=#|$)/, '/edit');
    }
  }
  
  // Google Slides
  if (lowercaseUrl.includes('docs.google.com/presentation')) {
    if (url.includes('/edit')) {
      return url;
    } else {
      return url.replace(/\/preview(?:[^\/]*)?(?=#|$)/, '/edit')
                .replace(/\/pub(?:[^\/]*)?(?=#|$)/, '/edit');
    }
  }
  
  return url;
};

const extractYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};
