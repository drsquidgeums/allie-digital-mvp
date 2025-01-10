import { cn } from "@/lib/utils";

interface ChatMessageProps {
  text: string;
  isUser: boolean;
}

export const ChatMessage = ({ text, isUser }: ChatMessageProps) => {
  return (
    <div 
      className="w-full flex flex-col"
      role="article"
      aria-label={isUser ? "Your message" : "Allie's response"}
    >
      <div
        className={cn(
          "p-2 rounded-lg max-w-[80%] whitespace-pre-wrap w-fit",
          isUser ? "bg-primary text-primary-foreground self-end" : "bg-muted self-start"
        )}
      >
        {text}
      </div>
    </div>
  );
};