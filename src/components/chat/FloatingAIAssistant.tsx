
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Bot, MessageCircle, X, Maximize2, Minimize2, Sparkles } from "lucide-react";
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
  const chatButtonRef = useRef<HTMLButtonElement>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Add initial welcome message when chat is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: "Hi! I'm Allie, your virtual AI learning assistant. What can I help you with today?",
        isUser: false
      }]);
    }
  }, [isOpen, messages.length, setMessages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  const toggleChat = () => {
    setIsOpen(prev => {
      const newState = !prev;
      // Focus management for accessibility
      if (!newState && chatButtonRef.current) {
        chatButtonRef.current.focus();
      }
      return newState;
    });
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

  // Handle escape key to close chat
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        toggleChat();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

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
          role="dialog"
          aria-labelledby="chat-title"
          aria-describedby="chat-description"
        >
          <div className="flex flex-col h-full">
            <div className="p-3 border-b flex justify-between items-center">
              <div>
                <div id="chat-title" className="sr-only">AI Assistant Chat</div>
                <div id="chat-description" className="sr-only">Chat with Allie, your AI learning assistant</div>
                <ChatHeader />
              </div>
              <div className="flex items-center gap-1" role="group" aria-label="Chat controls">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleExpand}
                  className="h-8 w-8"
                  aria-label={isExpanded ? "Minimize chat window" : "Expand chat window"}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleChat}
                  className="h-8 w-8"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-3 flex-1 flex flex-col overflow-hidden">
              {documentContent && (
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-2 text-sm mb-3" role="status" aria-label="Document loaded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    <span className="truncate max-w-[150px]">{documentName || "Document loaded"}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1 text-xs min-h-[32px]"
                    onClick={handleAnalyzeDocument}
                    disabled={analyzing || isLoading}
                    aria-label="Analyze the loaded document"
                  >
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Analyze
                  </Button>
                </div>
              )}
              
              <div 
                className="flex-1 overflow-y-auto space-y-2 p-2"
                role="log"
                aria-live="polite"
                aria-label="Chat conversation"
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
                  <div className="flex items-center gap-2" aria-label="AI is thinking" role="status">
                    <div className="w-12 h-6 bg-muted/50 rounded animate-pulse" aria-hidden="true" />
                    <span className="sr-only">AI is processing your request</span>
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
          ref={chatButtonRef}
          onClick={toggleChat}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 min-h-[56px] min-w-[56px]"
          aria-label="Open AI Assistant chat"
        >
          <Bot className="h-6 w-6" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
};
