import { MindMapNode } from '../types';
import { toPng } from 'html-to-image';
import { type ToastProps } from "@/components/ui/toast";

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

export const downloadMindMap = async (toast: (props: ToastProps) => void) => {
  const element = document.querySelector('.react-flow') as HTMLElement;
  if (!element) {
    toast({
      title: "Error",
      description: "Could not find the mind map element",
      variant: "destructive",
    });
    return;
  }

  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
    });
    
    const link = document.createElement('a');
    link.download = 'mindmap.jpg';
    link.href = dataUrl;
    link.click();
    
    toast({
      title: "Success",
      description: "Mind map downloaded successfully",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to download mind map",
      variant: "destructive",
    });
  }
};