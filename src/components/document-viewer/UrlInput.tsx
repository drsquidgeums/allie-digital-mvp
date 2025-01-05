import React from 'react';
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
}

export const UrlInput = ({ url, setUrl }: UrlInputProps) => {
  const { toast } = useToast();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value.trim();
    
    if (!newUrl) {
      setUrl("");
      return;
    }

    try {
      if (newUrl.startsWith('data:') || newUrl.startsWith('blob:')) {
        setUrl(newUrl);
        return;
      }

      let processedUrl = newUrl;
      if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
        processedUrl = `https://${newUrl}`;
      }

      // Validate URL
      new URL(processedUrl);
      setUrl(processedUrl);
    } catch (error) {
      console.error('Invalid URL:', error);
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-4">
      <Input
        type="url"
        placeholder="Paste URL here"
        className="w-full"
        value={url}
        onChange={handleUrlChange}
      />
    </div>
  );
};