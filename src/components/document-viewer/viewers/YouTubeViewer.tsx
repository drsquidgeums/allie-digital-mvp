import React from 'react';
import { getYouTubeEmbedUrl } from '@/utils/contentUtils';

interface YouTubeViewerProps {
  url: string;
}

export const YouTubeViewer: React.FC<YouTubeViewerProps> = ({ url }) => {
  const embedUrl = getYouTubeEmbedUrl(url);

  return (
    <div className="relative w-full pt-[56.25%]">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={embedUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};