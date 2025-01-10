import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  "aria-label"?: string;
}

export const ChatInput = ({ 
  value, 
  onChange, 
  onSend, 
  isLoading,
  "aria-label": ariaLabel 
}: ChatInputProps) => {
  return (
    <div 
      className="flex gap-2"
      role="group"
      aria-label="Message input controls"
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask about study tips or how to use our tools..."
        onKeyPress={(e) => e.key === "Enter" && onSend()}
        disabled={isLoading}
        aria-label={ariaLabel}
        className="text-base min-h-[44px]"
      />
      <Button 
        onClick={onSend} 
        size="icon" 
        disabled={isLoading}
        aria-label="Send message"
        className="min-w-[44px] min-h-[44px]"
      >
        <Send className="w-5 h-5" aria-hidden="true" />
      </Button>
    </div>
  );
};