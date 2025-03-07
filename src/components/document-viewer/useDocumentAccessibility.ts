
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useDocumentAccessibility = (
  selectedFile: File | null, 
  url: string
) => {
  const { toast } = useToast();

  useEffect(() => {
    if (selectedFile || url) {
      try {
        // Find and activate the Bionic Reader and TTS tools
        const toolbarTools = document.querySelectorAll('[data-tool-id]');
        const bionicTool = Array.from(toolbarTools).find(
          tool => tool.getAttribute('data-tool-id') === 'bionic'
        );
        const ttsTool = Array.from(toolbarTools).find(
          tool => tool.getAttribute('data-tool-id') === 'tts'
        );

        // Programmatically click the tools to activate them
        if (bionicTool instanceof HTMLElement) {
          bionicTool.click();
        }
        if (ttsTool instanceof HTMLElement) {
          ttsTool.click();
        }

        toast({
          title: "Tools activated",
          description: "Bionic Reader and Text-to-Speech are now available for this document",
        });
      } catch (error) {
        console.error("Error activating document tools:", error);
        // Don't show error toast here to avoid overwhelming the user
      }
    }
  }, [selectedFile, url, toast]);
};
