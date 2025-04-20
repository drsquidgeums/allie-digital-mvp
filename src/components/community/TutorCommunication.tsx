import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Clock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createOpenAICompletion } from "@/utils/openai";
import { ChatMessage } from "../chat/ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { handleError } from "@/utils/errorHandling";

const TutorCommunication = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; timestamp: Date }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTutor, setActiveTutor] = useState({
    name: "Ms. Thompson",
    subject: "Learning Strategies",
    responseTime: "Usually responds within 2 hours",
    status: "available" as "available" | "away" | "busy"
  });
  const { toast } = useToast();

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        text: `Hello there! I'm ${activeTutor.name}, your ${activeTutor.subject} tutor. How can I help you today?`,
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, []);

  const handleSubmit = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = {
      text: message,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    setMessage("");
    setIsLoading(true);
    
    try {
      toast({
        title: "Tutor Notified",
        description: `${activeTutor.name} is reviewing your question.`,
      });
      
      const formattedPrompt = [
        { role: "system", content: `You are ${activeTutor.name}, a supportive tutor for students with ADHD and learning differences. Respond in a friendly, encouraging tone with short paragraphs and bullet points when appropriate. Focus on providing learning strategies, study techniques, and accessibility tips relevant to the student's query.` },
        { role: "user", content: message }
      ];
      
      setTimeout(async () => {
        try {
          const tutorResponse = await createOpenAICompletion(formattedPrompt);
          
          setMessages(prev => [...prev, {
            text: tutorResponse || "I'll need to review this more carefully. Let me get back to you soon!",
            isUser: false,
            timestamp: new Date()
          }]);
        } catch (error) {
          handleError(error, {
            title: "Tutor AI Error",
            showToast: false,
          });
          
          setMessages(prev => [...prev, {
            text: "Thanks for your question! I'll need some time to prepare a thorough response. I'll get back to you soon.",
            isUser: false,
            timestamp: new Date()
          }]);
        } finally {
          setIsLoading(false);
        }
      }, 2000);
      
    } catch (error) {
      handleError(error, {
        title: "Message Error",
        fallbackMessage: "There was a problem sending your message"
      });
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="p-4 flex flex-col h-full min-h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Tutor Communication</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div 
            className={`w-2 h-2 rounded-full ${
              activeTutor.status === 'available' ? 'bg-green-500' : 
              activeTutor.status === 'away' ? 'bg-amber-500' : 'bg-red-500'
            }`} 
          />
          <span className="text-xs text-muted-foreground">
            {activeTutor.status === 'available' ? 'Online' : 
             activeTutor.status === 'away' ? 'Away' : 'Busy'}
          </span>
        </div>
      </div>
      
      <div className="space-y-4 flex-1 flex flex-col">
        <div className="bg-accent/50 p-3 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{activeTutor.name}</p>
            <p className="text-xs text-muted-foreground">{activeTutor.subject}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {activeTutor.responseTime}
          </div>
        </div>

        <ScrollArea className="flex-1 h-[220px] pr-4 mb-2">
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className="flex flex-col gap-1">
                <ChatMessage 
                  text={msg.text} 
                  isUser={msg.isUser} 
                />
                <span className="text-xs text-muted-foreground self-end">
                  {msg.isUser ? 'You' : activeTutor.name} • {formatMessageTime(msg.timestamp)}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <div className="w-6 h-6 flex items-center justify-center relative">
                  <div className="animate-pulse w-2 h-2 bg-primary rounded-full absolute"></div>
                </div>
                <span>{activeTutor.name} is typing...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-auto">
          <Textarea
            placeholder="Type your question here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] dark:bg-[#333333] dark:border-white/20 mb-2"
            disabled={isLoading}
          />

          <Button onClick={handleSubmit} className="w-full" disabled={isLoading || !message.trim()}>
            {isLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-white rounded-full"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Question
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const formatMessageTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  if (diffMs < 60000) {
    return 'Just now';
  }
  
  if (diffMs < 3600000) {
    const minutes = Math.floor(diffMs / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  
  return date.toLocaleDateString();
};

export default TutorCommunication;
