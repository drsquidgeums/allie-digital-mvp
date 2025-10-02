import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, X } from "lucide-react";
import { useDocumentAIChat } from "@/hooks/useDocumentAIChat";

interface DocumentAIChatProps {
  documentContent?: string;
  documentName?: string;
  onClose?: () => void;
  isInPopover?: boolean;
}

export const DocumentAIChat: React.FC<DocumentAIChatProps> = ({
  documentContent,
  documentName,
  onClose,
}) => {
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage, clearMessages } = useDocumentAIChat(documentContent);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    await sendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: "Summarize", prompt: "Please summarize this document in bullet points" },
    { label: "Explain Key Concepts", prompt: "Explain the key concepts in this document" },
    { label: "Create Quiz", prompt: "Create 5 quiz questions based on this document" },
  ];

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">AI Document Assistant</h3>
            {documentName && (
              <p className="text-xs text-muted-foreground">{documentName}</p>
            )}
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ask me anything about your document, or try one of these:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(action.prompt)}
                  disabled={isLoading || !documentContent}
                >
                  {action.label}
                </Button>
              ))}
            </div>
            {!documentContent && (
              <p className="text-xs text-muted-foreground">
                Upload a document to get started
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t space-y-2">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about the document..."
            disabled={isLoading || !documentContent}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || !documentContent}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            className="w-full text-xs"
          >
            Clear Chat
          </Button>
        )}
      </div>
    </Card>
  );
};
