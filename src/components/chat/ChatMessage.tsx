import { cn } from "@/lib/utils";

interface ChatMessageProps {
  text: string;
  isUser: boolean;
  tabIndex?: number;
}

export const ChatMessage = ({ text, isUser, tabIndex }: ChatMessageProps) => {
  return (
    <div 
      className="w-full flex flex-col"
      role="article"
      aria-label={isUser ? "Your message" : "Allie's response"}
      tabIndex={tabIndex}
    >
      <div
        className={cn(
          "p-2 rounded-lg max-w-[80%] whitespace-pre-wrap w-fit focus:outline-none focus:ring-2 focus:ring-primary",
          isUser ? "bg-primary text-primary-foreground self-end" : "bg-muted self-start"
        )}
      >
        {text}
      </div>
    </div>
  );
};