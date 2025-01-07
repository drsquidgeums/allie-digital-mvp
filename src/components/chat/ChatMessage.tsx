import { cn } from "@/lib/utils";

interface ChatMessageProps {
  text: string;
  isUser: boolean;
}

export const ChatMessage = ({ text, isUser }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "p-2 rounded-lg max-w-[80%] whitespace-pre-wrap inline-block w-fit",
        isUser ? "bg-primary text-primary-foreground ml-0" : "bg-muted mr-0"
      )}
    >
      {text}
    </div>
  );
};