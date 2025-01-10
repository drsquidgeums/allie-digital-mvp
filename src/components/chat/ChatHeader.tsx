import { Bot } from "lucide-react";

export const ChatHeader = () => {
  return (
    <div className="flex items-center gap-2" role="banner">
      <Bot className="w-4 h-4" aria-hidden="true" />
      <h3 className="font-medium">Allie</h3>
    </div>
  );
};