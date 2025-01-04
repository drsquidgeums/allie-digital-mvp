import { toPng } from 'html-to-image';
import { type ToastType } from "@/hooks/use-toast";

export const downloadMindMap = async (toast: ToastType) => {
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