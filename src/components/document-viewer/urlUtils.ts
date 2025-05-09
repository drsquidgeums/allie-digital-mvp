
export const getUrlType = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase() || '';
  if (extension === 'pdf') return 'pdf';
  if (extension === 'txt') return 'txt';
  if (extension === 'html' || extension === 'htm') return 'html';
  if (isVideoUrl(url)) return 'video';
  return 'webpage';
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

  return url;
};

const extractYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};
