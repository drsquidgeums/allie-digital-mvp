
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { UrlInput } from "./UrlInput";
import { useTranslation } from "react-i18next";

interface UrlInputHandlerProps {
  url: string;
  setUrl: (url: string) => void;
}

/**
 * UrlInputHandler Component
 * 
 * Manages URL input field and associated handlers
 */
export const UrlInputHandler: React.FC<UrlInputHandlerProps> = ({ 
  url, 
  setUrl 
}) => {
  const { toast } = useToast();
  const { t } = useTranslation();

  /**
   * Handles keyboard events for the URL input field
   * - Escape key clears the URL and removes focus
   * - Enter key confirms the URL and shows a toast notification
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setUrl('');
      e.currentTarget.blur();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (url.trim()) {
        toast({
          title: t("notifications.urlLoaded"),
          description: t("notifications.urlLoadedDescription"),
        });
      }
    }
  };

  /**
   * Updates the URL state when the input field changes
   */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  /**
   * Handles URL submission
   */
  const handleUrlSubmit = (submittedUrl: string) => {
    if (submittedUrl.trim()) {
      setUrl(submittedUrl);
      toast({
        title: t("notifications.urlLoaded"),
        description: t("notifications.urlLoadedDescription"),
      });
    }
  };

  return (
    <UrlInput
      url={url}
      onChange={handleUrlChange}
      onKeyDown={handleKeyDown}
      onSubmit={handleUrlSubmit}
      placeholder={t('tools.pasteUrl')}
      buttonLabel={t('tools.go')}
    />
  );
};
