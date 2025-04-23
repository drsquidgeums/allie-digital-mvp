
import React from "react";

export interface ChatMessageProps {
  text: string;
  isUser: boolean;
  tabIndex?: number;
}

export const ChatMessage = ({ text, isUser, tabIndex = 0 }: ChatMessageProps) => {
  return (
    <div 
      className={`p-2.5 rounded-lg max-w-[85%] ${
        isUser ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted/50'
      }`}
      role="article"
      tabIndex={tabIndex}
    >
      <p className="text-sm whitespace-pre-wrap break-words">
        {text}
      </p>
    </div>
  );
};
