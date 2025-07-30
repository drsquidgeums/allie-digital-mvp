
import React, { useState, useCallback, memo } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export const CommunityChat = memo(() => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks for your message! Our team will get back to you soon.", 
        isUser: false 
      }]);
      setInputValue("");
      setIsLoading(false);
    }, 1000);
  }, [inputValue]);

  const handleChangeInput = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chat with Us</h2>
      <div className="space-y-4">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                message.isUser 
                  ? 'bg-primary text-primary-foreground ml-12' 
                  : 'bg-muted mr-12'
              }`}>
                {message.text}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => handleChangeInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
});

CommunityChat.displayName = "CommunityChat";
