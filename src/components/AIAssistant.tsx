
import React, { useRef, useEffect, useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { ChatHeader } from "./chat/ChatHeader";
import { useChatLogic } from "@/hooks/useChatLogic";
import { Button } from "./ui/button";
import { FileText, Sparkles } from "lucide-react";

interface AIAssistantProps {
  documentContent?: string;
  documentName?: string;
}

export const AIAssistant = React.memo(({ documentContent, documentName }: AIAssistantProps) => {
  const { input, setInput, messages, isLoading, handleSend, analyzeDocument } = useChatLogic(documentContent);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setInput('');
    }
  }, [setInput]);

  // Handle keyboard navigation within messages
  const handleMessagesKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const messages = chatContainerRef.current?.querySelectorAll('[role="article"]');
      if (!messages?.length) return;

      const currentFocus = document.activeElement;
      const currentIndex = Array.from(messages).indexOf(currentFocus as Element);
      
      let nextIndex;
      if (e.key === 'ArrowUp') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : messages.length - 1;
      } else {
        nextIndex = currentIndex < messages.length - 1 ? currentIndex + 1 : 0;
      }

      (messages[nextIndex] as HTMLElement).focus();
    }
  }, []);

  const handleAnalyzeDocument = async () => {
    if (!documentContent || analyzing) return;
    
    setAnalyzing(true);
    setMessages(prev => [...prev, { 
      text: `Please analyze the concepts in "${documentName || 'this document'}"`, 
      isUser: true 
    }]);
    
    const analysis = await analyzeDocument(documentContent);
    
    setMessages(prev => [...prev, { 
      text: analysis, 
      isUser: false 
    }]);
    
    setAnalyzing(false);
    scrollToBottom();
  };

  const memoizedInput = React.useMemo(() => (
    <ChatInput
      value={input}
      onChange={setInput}
      onSend={handleSend}
      isLoading={isLoading || analyzing}
    />
  ), [input, setInput, handleSend, isLoading, analyzing]);

  return (
    <Card 
      className="h-full bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative border-none shadow-lg ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      role="region"
      aria-label="AI Assistant Chat Interface"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="p-4 space-y-4">
        <ChatHeader />
        
        {documentContent && (
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-2 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="truncate max-w-[200px]">{documentName || "Document loaded"}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1 text-xs"
              onClick={handleAnalyzeDocument}
              disabled={analyzing || isLoading}
            >
              <Sparkles className="h-3 w-3" />
              Analyze Concepts
            </Button>
          </div>
        )}
        
        <div 
          ref={chatContainerRef}
          className="bg-card rounded-lg p-3 h-[calc(100vh-12rem)] overflow-y-auto space-y-2 focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 ease-in-out"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
          onKeyDown={handleMessagesKeyDown}
          tabIndex={0}
        >
          {messages.map((msg, idx) => (
            <ChatMessage 
              key={idx} 
              text={msg.text} 
              isUser={msg.isUser}
              tabIndex={0}
            />
          ))}
          {(isLoading || analyzing) && (
            <div 
              className="flex items-center gap-2" 
              aria-label="Loading response"
              role="status"
            >
              <div className="w-12 h-6 bg-muted/50 rounded animate-pulse" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {memoizedInput}
      </div>
    </Card>
  );
});

AIAssistant.displayName = "AIAssistant";
