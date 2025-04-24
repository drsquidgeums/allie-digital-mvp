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
        placeholder="Paste URL here"
        className="w-full"
        value={url}
        onChange={onChange}
        onKeyDown={onKeyDown}
        aria-label="Document URL input"
        role="textbox"
        aria-describedby="url-input-help"
      />
      <div id="url-input-help" className="sr-only">
        Press Enter to load the URL or Escape to clear the input
      </div>
    </div>
  );
};