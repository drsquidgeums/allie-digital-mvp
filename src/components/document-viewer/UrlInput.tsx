
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  buttonLabel?: string;
}

export const UrlInput: React.FC<UrlInputProps> = ({
  onSubmit,
  isLoading = false,
  placeholder,
  buttonLabel,
}) => {
  const [url, setUrl] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg space-x-2">
      <Input
        type="url"
        placeholder={placeholder || t('tools.pasteUrl')}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={isLoading}
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={!url.trim() || isLoading}
        variant="outline"
        size="sm"
        className="h-9"
      >
        <Link className="h-4 w-4 mr-2" />
        {buttonLabel || "Go"}
      </Button>
    </form>
  );
};
