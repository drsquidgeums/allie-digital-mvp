
import { Bot } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ChatHeader = () => {
  const { t } = useTranslation();
  
  return (
    <div 
      className="flex items-center gap-3 p-3 bg-card rounded-t-lg shadow-sm" 
      role="banner"
      aria-label={t('chat.title', 'Chat header')}
    >
      <Bot className="w-5 h-5 text-primary" aria-hidden="true" />
      <h3 className="text-lg font-semibold">{t('chat.title', 'Allie.ai')}</h3>
      <span className="sr-only">{t('chat.assistantLabel', 'Virtual learning assistant chat interface')}</span>
    </div>
  );
};
