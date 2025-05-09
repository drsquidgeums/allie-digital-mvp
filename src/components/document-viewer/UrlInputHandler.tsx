
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UrlInputHandlerProps {
  url: string;
  setUrl: (url: string) => void;
}

/**
 * UrlInputHandler Component
 * 
 * Handles URL input for loading external documents
 */
export const UrlInputHandler: React.FC<UrlInputHandlerProps> = ({ url, setUrl }) => {
  const [inputValue, setInputValue] = useState(url);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic URL validation
    if (!inputValue) {
      return;
    }
    
    try {
      // Ensure URL has http/https protocol
      let processedUrl = inputValue;
      if (!/^https?:\/\//i.test(inputValue)) {
        processedUrl = `https://${inputValue}`;
      }
      
      // Check URL validity
      new URL(processedUrl);
      
      // Update the URL state
      setUrl(processedUrl);
      toast({
        title: "URL loaded",
        description: "Loading document from URL",
      });
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Enter document URL (https://example.com/document.pdf)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
          aria-label="Document URL"
        />
        <Button 
          type="submit"
          variant="outline"
          size="icon"
          aria-label="Load URL"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

