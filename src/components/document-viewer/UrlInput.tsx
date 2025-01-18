import React from "react";
import { Input } from "@/components/ui/input";

interface UrlInputProps {
  url: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const UrlInput = ({ url, onChange, onKeyDown }: UrlInputProps) => {
  return (
    <div className="mb-4">
      <Input
        type="url"
        placeholder="Paste URL here (supports YouTube videos, PDFs, and web pages)"
        className="w-full"
        value={url}
        onChange={onChange}
        onKeyDown={onKeyDown}
        aria-label="Content URL input"
        role="textbox"
        aria-describedby="url-input-help"
      />
      <div id="url-input-help" className="mt-1 text-sm text-muted-foreground">
        Press Enter to load the URL or Escape to clear the input. You can paste YouTube links, PDF URLs, or any web page.
      </div>
    </div>
  );
};