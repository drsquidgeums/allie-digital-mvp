import React from 'react';

interface PdfCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const PdfCanvas: React.FC<PdfCanvasProps> = ({ canvasRef }) => {
  return (
    <div className="flex-1 overflow-auto p-4">
      <canvas
        ref={canvasRef}
        className="mx-auto"
        style={{ backgroundColor: 'white' }}
      />
    </div>
  );
};