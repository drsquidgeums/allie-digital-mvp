import React from 'react';

interface PdfTextLayerProps {
  selectedColor: string;
}

export const PdfTextLayer: React.FC<PdfTextLayerProps> = ({ selectedColor }) => {
  return (
    <style>
      {`
        .textLayer {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          opacity: 0.2;
          line-height: 1.0;
        }

        .textLayer > span {
          color: transparent;
          position: absolute;
          white-space: pre;
          cursor: text;
          transform-origin: 0% 0%;
        }

        .textLayer ::selection {
          background: ${selectedColor};
          opacity: 0.3;
        }
      `}
    </style>
  );
};