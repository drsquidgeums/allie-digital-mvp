
import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UrlInputProps {
  onSubmit?: (url: string) => void;
  url?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
  placeholder?: string;
  buttonLabel?: string;
}

export const UrlInput: React.FC<UrlInputProps> = ({
  onSubmit,
  url = "",
  onChange,
  onKeyDown,
  isLoading = false,
  placeholder,
  buttonLabel,
}) => {
  const [internalUrl, setInternalUrl] = useState(url);
  const { t } = useTranslation();

  // Use internal state management if no external state control is provided
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    } else {
      setInternalUrl(e.target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitUrl = onChange ? url : internalUrl;
    if (submitUrl.trim() && onSubmit) {
      onSubmit(submitUrl.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg space-x-2">
      <Input
        type="url"
        placeholder={placeholder || t('tools.pasteUrl')}
        value={onChange ? url : internalUrl}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        disabled={isLoading}
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={!(onChange ? url : internalUrl).trim() || isLoading}
        variant="outline"
        size="sm"
        className="h-9"
      >
        <Link className="h-4 w-4 mr-2" />
        {buttonLabel || t('tools.go')}
      </Button>
    </form>
  );
};
