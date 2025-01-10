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
      aria-label={`${isUser ? 'Your message' : 'AI response'}`}
    >
      <div
        className={cn(
          "p-4 rounded-lg max-w-[80%] whitespace-pre-wrap w-fit",
          "focus:outline-2 focus:outline-offset-2 focus:outline-primary",
          "text-base leading-relaxed",
          isUser 
            ? "bg-primary text-primary-foreground self-end" 
            : "bg-muted self-start"
        )}
        tabIndex={0}
      >
        {text}
      </div>
    </div>
  );
};