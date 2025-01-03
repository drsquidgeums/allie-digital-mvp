import { cn } from "@/lib/utils";

interface ChatMessageProps {
  text: string;
  isUser: boolean;
}

export const ChatMessage = ({ text, isUser }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "p-2 rounded-lg max-w-[80%] whitespace-pre-line",
        isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-muted mr-auto"
      )}
    >
      {text}
    </div>
  );
};