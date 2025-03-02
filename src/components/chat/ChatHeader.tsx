
import { Bot } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ChatHeader = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-3 p-3 border-b border-border bg-card rounded-t-lg shadow-sm" role="banner">
      <Bot className="w-5 h-5 text-primary" aria-hidden="true" />
      <h3 className="text-lg font-semibold">Allie.ai</h3>
    </div>
  );
};
