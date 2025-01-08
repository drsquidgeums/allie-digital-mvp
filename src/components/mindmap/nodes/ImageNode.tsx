import React, { useState, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

interface ImageNodeProps {
  data: {
    label: string;
    imageUrl?: string;
  };
}

export const ImageNode: React.FC<ImageNodeProps> = ({ data }) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(data.imageUrl);
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });

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
      className="relative bg-background border rounded-md flex items-center justify-center cursor-pointer"
      onContextMenu={handleContextMenu}
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
      }}
    >
      <Handle type="target" position={Position.Top} />
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Node content" 
          className="w-full h-full object-contain rounded-md"
          onLoad={handleImageLoad}
        />
      ) : (
        <div className="text-sm text-muted-foreground text-center p-4">
          Right click to insert an image
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};