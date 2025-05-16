
import { useState } from 'react';
import { toPng } from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import { useSecurityContext } from '@/components/security/SecurityProvider';

interface CaptureArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const useScreenshot = () => {
  const { toast } = useToast();
  const [isSelecting, setIsSelecting] = useState(false);
  const { enableAntiScreenCapture } = useSecurityContext();

  const startSelection = () => {
    // If anti-screen capture is enabled, don't allow screenshots
    if (enableAntiScreenCapture) {
      toast({
        title: "Screenshot Disabled",
        description: "Screenshots are disabled due to security settings.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSelecting(true);
    toast({
      title: "Selection mode active",
      description: "Click and drag to select an area to capture",
    });

    // Create selection overlay
    const overlay = document.createElement('div');
    overlay.id = 'screenshot-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
    overlay.style.cursor = 'crosshair';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);

    // Add selection box
    const selectionBox = document.createElement('div');
    selectionBox.id = 'selection-box';
    selectionBox.style.position = 'fixed';
    selectionBox.style.border = '2px dashed #fff';
    selectionBox.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
    selectionBox.style.display = 'none';
    selectionBox.style.zIndex = '10000';
    document.body.appendChild(selectionBox);

    let startX: number, startY: number;

    const cleanup = () => {
      overlay.onmousemove = null;
      overlay.onmouseup = null;
      if (document.body.contains(overlay)) document.body.removeChild(overlay);
      if (document.body.contains(selectionBox)) document.body.removeChild(selectionBox);
      setIsSelecting(false);
    };

    // Handle ESC key to cancel selection
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanup();
        document.removeEventListener('keydown', handleEscKey);
      }
    };
    document.addEventListener('keydown', handleEscKey);

    overlay.onmousedown = (e) => {
      startX = e.clientX;
      startY = e.clientY;
      selectionBox.style.display = 'block';
      selectionBox.style.left = startX + 'px';
      selectionBox.style.top = startY + 'px';

      overlay.onmousemove = (e) => {
        const currentX = e.clientX;
        const currentY = e.clientY;
        const width = currentX - startX;
        const height = currentY - startY;

        selectionBox.style.width = Math.abs(width) + 'px';
        selectionBox.style.height = Math.abs(height) + 'px';
        selectionBox.style.left = (width < 0 ? currentX : startX) + 'px';
        selectionBox.style.top = (height < 0 ? currentY : startY) + 'px';
      };

      overlay.onmouseup = (e) => {
        const endX = e.clientX;
        const endY = e.clientY;
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        const x = Math.min(startX, endX);
        const y = Math.min(startY, endY);

        if (width > 10 && height > 10) {
          captureScreenshot({ x, y, width, height });
        } else {
          toast({
            title: "Selection too small",
            description: "Please select a larger area",
          });
        }
        
        cleanup();
        document.removeEventListener('keydown', handleEscKey);
      };
    };
  };

  const captureScreenshot = async (area: CaptureArea) => {
    try {
      toast({
        title: "Capturing screenshot",
        description: "Please wait while we process your screenshot...",
      });

      // Remove any existing screenshot elements
      const existingOverlay = document.getElementById('screenshot-overlay');
      const existingBox = document.getElementById('selection-box');
      if (existingOverlay) document.body.removeChild(existingOverlay);
      if (existingBox) document.body.removeChild(existingBox);

      // Wait a moment for UI to update
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = document.body;
      const scale = window.devicePixelRatio;

      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: scale,
        filter: (node) => {
          const element = node as HTMLElement;
          return (
            !element.id?.includes('screenshot-overlay') &&
            !element.id?.includes('selection-box') &&
            !element.classList?.contains('radix-toast')
          );
        },
      });

      // Create a canvas to crop the image
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      canvas.width = area.width * scale;
      canvas.height = area.height * scale;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(
          img,
          area.x * scale,
          area.y * scale,
          area.width * scale,
          area.height * scale,
          0,
          0,
          area.width * scale,
          area.height * scale
        );

        const croppedDataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = croppedDataUrl;
        link.click();

        toast({
          title: "Screenshot captured",
          description: "Your screenshot has been downloaded",
        });
      }
    } catch (error) {
      console.error('Error taking screenshot:', error);
      toast({
        title: "Error",
        description: "Failed to capture screenshot",
        variant: "destructive",
      });
    } finally {
      setIsSelecting(false);
    }
  };

  return {
    isSelecting,
    enableAntiScreenCapture,
    startSelection
  };
};
