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
      className="relative w-[200px] h-[200px] bg-background border rounded-md flex items-center justify-center cursor-pointer"
      onContextMenu={handleContextMenu}
    >
      <Handle type="target" position={Position.Top} />
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Node content" 
          className="w-full h-full object-contain rounded-md"
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