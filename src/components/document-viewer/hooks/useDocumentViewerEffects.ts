
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook to handle side effects for the document viewer
 * Manages accessibility tool notifications
 */
export const useDocumentViewerEffects = (
  selectedFile: File | null,
  url: string
) => {
  const { toast } = useToast();

  /**
   * Notify user about available accessibility tools when content is loaded
   * This useEffect no longer auto-activates tools, just notifies about their availability
   */
  useEffect(() => {
    if (selectedFile || url) {
      try {
        toast({
          title: "Document loaded",
          description: "Bionic Reader and Text-to-Speech are available in the toolbar",
        });
      } catch (error) {
        console.error("Error in document viewer effects:", error);
      }
    }
  }, [selectedFile, url, toast]);

  return { toast };
};
