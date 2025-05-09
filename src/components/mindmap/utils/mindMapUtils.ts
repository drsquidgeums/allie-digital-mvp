import { toast } from "sonner";
import { toPng } from 'html-to-image';

export const downloadMindMapAsJpg = async () => {
  const element = document.querySelector('.react-flow') as HTMLElement;
  if (!element) {
    toast("Could not find the mind map element");
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
    
    toast("Mind map downloaded as JPG");
  } catch (error) {
    toast("Failed to download mind map");
  }
};

export const downloadMindMapAsJson = (nodes: any[], edges: any[]) => {
  const data = { nodes, edges };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "mindmap.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  
  toast("Mind map downloaded as JSON");
};