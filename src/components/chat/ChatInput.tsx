
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { SecureInput } from "@/components/security/SecureInput";
import { detectXSS } from "@/utils/inputValidation";
import { toast } from "sonner";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export const ChatInput = ({ value, onChange, onSend, isLoading }: ChatInputProps) => {
  const handleSecureChange = (sanitizedValue: string) => {
    // Additional validation for chat input
    if (detectXSS(sanitizedValue)) {
      toast.error("Invalid input detected");
      return;
    }
    
    onChange(sanitizedValue);
  };

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
      <SecureInput
        value={value}
        onSecureChange={handleSecureChange}
        placeholder="Ask about study tips or how to use our tools..."
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        aria-label="Chat input"
        className="focus:ring-2 focus:ring-primary focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out hover:border-primary/50"
        maxLength={1000}
      />
      <Button 
        onClick={onSend} 
        size="icon" 
        disabled={isLoading}
        aria-label="Send message"
        className="focus:ring-2 focus:ring-primary focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out hover:bg-primary/90 hover:scale-105 active:scale-95"
      >
        <Send className="w-4 h-4" aria-hidden="true" />
      </Button>
    </div>
  );
};
