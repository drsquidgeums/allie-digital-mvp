
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { UrlInput } from "./UrlInput";
import { useSavedUrls } from "@/hooks/useSavedUrls";

interface UrlInputHandlerProps {
  url: string;
  setUrl: (url: string) => void;
}

export const UrlInputHandler: React.FC<UrlInputHandlerProps> = ({ 
  url, 
  setUrl 
}) => {
  const { toast } = useToast();
  const { saveUrl, refreshUrls } = useSavedUrls();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setUrl('');
      e.currentTarget.blur();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (url.trim()) {
        try {
          // Save URL to database
          await saveUrl(url.trim());
          
          // Refresh the list of saved URLs to update My Files
          refreshUrls();
          
          toast({
            title: "URL saved",
            description: "Document URL has been loaded and saved to My Files",
          });
        } catch (error) {
          console.error('Error saving URL:', error);
          toast({
            title: "Error",
            description: "Failed to save URL. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <UrlInput
      url={url}
      onChange={handleUrlChange}
      onKeyDown={handleKeyDown}
    />
  );
};
