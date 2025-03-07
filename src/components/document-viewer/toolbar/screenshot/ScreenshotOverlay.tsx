
import React, { useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

interface ScreenshotOverlayProps {
  onComplete: (area: { x: number; y: number; width: number; height: number }) => void;
  onCancel: () => void;
}

export const ScreenshotOverlay: React.FC<ScreenshotOverlayProps> = ({ onComplete, onCancel }) => {
  const { toast } = useToast();
  const overlayRef = useRef<HTMLDivElement>(null);
  const selectionBoxRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const overlay = overlayRef.current;
    const selectionBox = selectionBoxRef.current;
    
    if (!overlay || !selectionBox) return;
    
    let startX: number, startY: number;
    
    // Handle ESC key to cancel selection
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    const handleMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      selectionBox.style.display = 'block';
      selectionBox.style.left = startX + 'px';
      selectionBox.style.top = startY + 'px';
      selectionBox.style.width = '0';
      selectionBox.style.height = '0';
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (selectionBox.style.display !== 'block') return;
      
      const currentX = e.clientX;
      const currentY = e.clientY;
      const width = currentX - startX;
      const height = currentY - startY;
      
      selectionBox.style.width = Math.abs(width) + 'px';
      selectionBox.style.height = Math.abs(height) + 'px';
      selectionBox.style.left = (width < 0 ? currentX : startX) + 'px';
      selectionBox.style.top = (height < 0 ? currentY : startY) + 'px';
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (selectionBox.style.display !== 'block') return;
      
      const endX = e.clientX;
      const endY = e.clientY;
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);
      const x = Math.min(startX, endX);
      const y = Math.min(startY, endY);
      
      if (width > 10 && height > 10) {
        onComplete({ x, y, width, height });
      } else {
        toast({
          title: "Selection too small",
          description: "Please select a larger area",
        });
        onCancel();
      }
    };
    
    overlay.addEventListener('mousedown', handleMouseDown);
    overlay.addEventListener('mousemove', handleMouseMove);
    overlay.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      overlay.removeEventListener('mousedown', handleMouseDown);
      overlay.removeEventListener('mousemove', handleMouseMove);
      overlay.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onComplete, onCancel, toast]);
  
  return (
    <>
      <div 
        ref={overlayRef}
        id="screenshot-overlay"
        className="fixed inset-0 bg-black bg-opacity-20 cursor-crosshair z-[9999]"
      />
      <div 
        ref={selectionBoxRef}
        id="selection-box"
        className="fixed border-2 border-dashed border-white bg-primary bg-opacity-10 hidden z-[10000]"
      />
    </>
  );
};
