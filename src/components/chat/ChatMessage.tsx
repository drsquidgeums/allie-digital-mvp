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
          "p-2 rounded-lg max-w-[80%] whitespace-pre-wrap w-fit focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors",
          isUser ? "bg-primary text-primary-foreground self-end hover:bg-primary/90" : "bg-muted self-start hover:bg-muted/90"
        )}
      >
        {text}
      </div>
    </div>
  );
};