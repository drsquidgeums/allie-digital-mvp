
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
      if (value.trim()) {
        onSend();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSendClick = () => {
    if (value.trim() && !isLoading) {
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
        onChange={handleInputChange}
        placeholder="Ask about study tips or how to use our tools..."
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        aria-label="Chat input"
        className="focus:ring-2 focus:ring-primary focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out hover:border-primary/50"
      />
      <Button 
        onClick={handleSendClick} 
        size="icon" 
        disabled={isLoading || !value.trim()}
        aria-label="Send message"
        className="focus:ring-2 focus:ring-primary focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out hover:bg-primary/90 hover:scale-105 active:scale-95"
      >
        <Send className="w-4 h-4" aria-hidden="true" />
      </Button>
    </div>
  );
};
