import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export const ChatInput = ({ value, onChange, onSend, isLoading }: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div 
      className="flex gap-2" 
      role="form"
      aria-label="Chat input form"
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask about study tips or how to use our tools..."
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        aria-label="Chat input"
        className="focus:ring-2 focus:ring-primary focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
      />
      <Button 
        onClick={onSend} 
        size="icon" 
        disabled={isLoading}
        aria-label="Send message"
        className="focus:ring-2 focus:ring-primary focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors hover:bg-primary/90"
      >
        <Send className="w-4 h-4" aria-hidden="true" />
      </Button>
    </div>
  );
};