
import { Bot } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ChatHeader = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-2" role="banner">
      <Bot className="w-4 h-4" aria-hidden="true" />
      <h3 className="font-medium">Allie.ai</h3>
    </div>
  );
};
