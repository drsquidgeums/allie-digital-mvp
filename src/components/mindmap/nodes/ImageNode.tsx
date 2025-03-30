
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Image, Upload } from 'lucide-react';

interface ImageNodeProps {
  data: {
    label: string;
    imageUrl?: string;
  };
}

export const ImageNode: React.FC<ImageNodeProps> = ({ data }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(data.imageUrl);
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });
  const [isHovering, setIsHovering] = useState(false);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const maxWidth = 400;
    const maxHeight = 300;
    let newWidth = img.naturalWidth;
    let newHeight = img.naturalHeight;

    // Calculate aspect ratio
    const aspectRatio = newWidth / newHeight;

    // Adjust dimensions if they exceed maximum values
    if (newWidth > maxWidth) {
      newWidth = maxWidth;
      newHeight = newWidth / aspectRatio;
    }
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = newHeight * aspectRatio;
    }

    setDimensions({ width: newWidth, height: newHeight });
  };

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImageUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, []);

  return (
    <div 
      className="relative bg-card border rounded-md flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-shadow group"
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-primary border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity"
      />
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Node content" 
          className="w-full h-full object-contain rounded-md"
          onLoad={handleImageLoad}
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full text-sm text-muted-foreground p-4 gap-2">
          <Image className="w-8 h-8 mb-2 opacity-50" />
          <p>Right-click to upload an image</p>
          <div className={`absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/20 rounded-md flex items-center justify-center ${isHovering ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
            <Upload className="w-6 h-6 text-primary/50" />
          </div>
        </div>
      )}
      <Handle 
        type="source" 
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity" 
      />
    </div>
  );
};
