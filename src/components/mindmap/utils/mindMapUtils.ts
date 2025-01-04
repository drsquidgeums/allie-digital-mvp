import { MindMapNode } from '../types';
import { toPng } from 'html-to-image';
import { Toast } from "@/hooks/use-toast";

export const createNewNode = (
  id: string,
  label: string,
  position: { x: number; y: number },
  color: string,
  isCustomColor: boolean
): MindMapNode => ({
  id,
  data: { label },
  position,
  style: {
    background: color,
    color: isCustomColor ? '#000000' : 'hsl(var(--foreground))',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid hsl(var(--border))',
  },
});

export const downloadMindMap = async (toast: Toast) => {
  const element = document.querySelector('.react-flow__viewport') as HTMLElement;
  if (!element) return;

  const { width, height } = element.getBoundingClientRect();
  
  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#fff',
      width,
      height,
      style: {
        transform: element.style.transform,
      },
    });
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'mindmap.jpg';
    link.click();
    
    toast({
      title: "Mind map downloaded",
      description: "Your mind map has been saved as JPG",
    });
  } catch (error) {
    console.error('Error downloading image:', error);
    toast({
      title: "Download failed",
      description: "Failed to download mind map as JPG",
      variant: "destructive",
    });
  }
};