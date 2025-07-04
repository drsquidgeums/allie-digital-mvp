
import React from 'react';
import { ManagedFile } from '@/hooks/file-manager/types';
import { FileText, Image, FileVideo, File } from 'lucide-react';

interface FilePreviewProps {
  file: ManagedFile;
  size?: 'sm' | 'md' | 'lg';
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, size = 'md' }) => {
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="h-full w-full text-green-500" />;
    } else if (type.startsWith('video/')) {
      return <FileVideo className="h-full w-full text-purple-500" />;
    } else if (type === 'application/pdf') {
      return <FileText className="h-full w-full text-red-500" />;
    } else if (type.includes('text/') || type.includes('document')) {
      return <FileText className="h-full w-full text-blue-500" />;
    } else {
      return <File className="h-full w-full text-gray-500" />;
    }
  };

  const getThumbnail = () => {
    // For images, show actual thumbnail if URL is available
    if (file.type.startsWith('image/') && file.url) {
      return (
        <img
          src={file.url}
          alt={file.name}
          className="w-full h-full object-cover rounded"
          onError={(e) => {
            // Fallback to icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }
    return null;
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0 relative`}>
      {getThumbnail()}
      <div className={`${file.type.startsWith('image/') && file.url ? 'hidden' : 'flex'} items-center justify-center w-full h-full bg-accent/50 rounded border`}>
        <div className={iconSizes[size]}>
          {getFileIcon(file.type)}
        </div>
      </div>
    </div>
  );
};
