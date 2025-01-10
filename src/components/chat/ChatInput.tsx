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
  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask about study tips or how to use our tools..."
        onKeyPress={(e) => e.key === "Enter" && onSend()}
        disabled={isLoading}
      />
      <Button onClick={onSend} size="icon" disabled={isLoading}>
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
};