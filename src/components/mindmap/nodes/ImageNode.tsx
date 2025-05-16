
import React, { useState } from 'react';
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

  const handleContextMenu = (event: React.MouseEvent) => {
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
  };

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
      {/* TOP HANDLE */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-primary border-2 border-background opacity-100 group-hover:opacity-100 transition-opacity"
        id="top"
      />
      
      {/* LEFT HANDLE */}
      <Handle 
        type="source" 
        position={Position.Left} 
        className="w-3 h-3 bg-primary border-2 border-background opacity-70 group-hover:opacity-100 transition-opacity"
        id="left"
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
          <img src="/placeholder.svg" className="w-12 h-12 mb-2 opacity-50" alt="Placeholder" />
          <p>Right-click to upload an image</p>
          <div className={`absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/20 rounded-md flex items-center justify-center ${isHovering ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary/50"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          </div>
        </div>
      )}
      
      {/* RIGHT HANDLE */}
      <Handle 
        type="source" 
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-background opacity-70 group-hover:opacity-100 transition-opacity"
        id="right"
      />
      
      {/* BOTTOM HANDLE */}
      <Handle 
        type="source" 
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-background opacity-100 group-hover:opacity-100 transition-opacity"
        id="bottom"
      />
    </div>
  );
};
