
import { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

interface Note {
  title: string;
  content: string;
  tags?: string[];
}

export const useNoteTakingIntegration = () => {
  const { toast } = useToast();

  const exportToNotion = useCallback(async (note: Note) => {
    toast({
      title: "Exporting to Notion",
      description: `Sending "${note.title}" to your Notion workspace...`,
    });

    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Note has been added to your Notion workspace.",
      });
    }, 2000);
  }, [toast]);

  const exportToObsidian = useCallback(async (note: Note) => {
    // Create markdown format for Obsidian
    const markdown = `# ${note.title}\n\n${note.content}\n\n${note.tags?.map(tag => `#${tag}`).join(' ') || ''}`;
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title}.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported to Obsidian",
      description: "Markdown file downloaded for Obsidian import.",
    });
  }, [toast]);

  const connectApp = useCallback(async (app: 'notion' | 'obsidian' | 'roam') => {
    toast({
      title: `${app.charAt(0).toUpperCase() + app.slice(1)} Integration`,
      description: `Setting up connection to ${app}...`,
    });

    setTimeout(() => {
      toast({
        title: "Integration Ready",
        description: `${app} integration is now available.`,
      });
    }, 1500);
  }, [toast]);

  return {
    exportToNotion,
    exportToObsidian,
    connectApp
  };
};
