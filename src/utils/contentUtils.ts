export const getContentType = (url: string): 'youtube' | 'pdf' | 'webpage' => {
  // YouTube URL patterns
  const youtubePatterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /^(https?:\/\/)?(www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/
  ];

  // Check if it's a YouTube URL
  if (youtubePatterns.some(pattern => pattern.test(url))) {
    return 'youtube';
  }

  // Check if it's a PDF
  if (url.toLowerCase().endsWith('.pdf')) {
    return 'pdf';
  }

  // Default to webpage
  return 'webpage';
};

export const getYouTubeEmbedUrl = (url: string): string => {
  // Extract video ID from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  return url;
};