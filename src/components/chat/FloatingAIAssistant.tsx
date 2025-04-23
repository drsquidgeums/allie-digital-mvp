import React, { useState, useRef, useEffect, useCallback } from "react";
import { Bot, MessageCircle, X, Maximize2, Minimize2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { useChatLogic } from "@/hooks/useChatLogic";
import { Button } from "../ui/button";
import { FileText } from "lucide-react";

interface FloatingAIAssistantProps {
  documentContent?: string;
  documentName?: string;
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({ 
  documentContent, 
  documentName 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { input, setInput, messages, setMessages, isLoading, handleSend, analyzeDocument } = useChatLogic(documentContent);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

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

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex flex-col items-end transition-all duration-300 ease-in-out ${isOpen ? 'space-y-4' : ''}`}>
      {isOpen && (
        <Card 
          className={`bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative border shadow-lg transition-all duration-300 ease-in-out
            ${isExpanded 
              ? 'w-[90vw] h-[80vh] max-w-4xl' 
              : 'w-80 h-96 sm:w-96 sm:h-[28rem]'
            }
          `}
        >
          <div className="flex flex-col h-full">
            <div className="p-3 border-b flex justify-between items-center">
              <ChatHeader />
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleExpand}
                  className="h-8 w-8"
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleChat}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-3 flex-1 flex flex-col overflow-hidden">
              {documentContent && (
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-2 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="truncate max-w-[150px]">{documentName || "Document loaded"}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1 text-xs"
                    onClick={handleAnalyzeDocument}
                    disabled={analyzing || isLoading}
                  >
                    {/* Using an alternative icon since Sparkle doesn't exist */}
                    <FileText className="h-3 w-3" />
                    Analyze
                  </Button>
                </div>
              )}
              
              <div 
                className="flex-1 overflow-y-auto space-y-2 p-2"
                role="log"
                aria-live="polite"
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
                  <div className="flex items-center gap-2" aria-label="Loading response">
                    <div className="w-12 h-6 bg-muted/50 rounded animate-pulse" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-3 border-t">
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
                isLoading={isLoading || analyzing}
              />
            </div>
          </div>
        </Card>
      )}

      {!isOpen && (
        <Button
          onClick={toggleChat}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
          aria-label="Open AI Assistant"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};
