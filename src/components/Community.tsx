import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Book, MessageSquare, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";

export const Community = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleShareResource = () => {
    toast({
      title: "Coming Soon",
      description: "Resource sharing will be available in the next update!",
    });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks for your message! Our team will get back to you soon.", 
        isUser: false 
      }]);
      setInputValue("");
      setIsLoading(false);
    }, 1000);
  };

  const discussions = [
    {
      title: "Study Tips & Tricks",
      author: "Sarah M.",
      replies: 23,
      category: "Learning Strategies"
    },
    {
      title: "Focus Mode Success Stories",
      author: "James K.",
      replies: 15,
      category: "Productivity"
    },
    {
      title: "Mind Mapping Templates",
      author: "Alex R.",
      replies: 31,
      category: "Resources"
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Community Hub</h1>
        <Button onClick={handleShareResource}>
          <Share2 className="mr-2 h-4 w-4" />
          Share Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center text-center">
          <Users className="h-8 w-8 mb-2" />
          <h3 className="font-semibold">Active Members</h3>
          <p className="text-2xl font-bold text-primary">1,234</p>
        </Card>

        <Card className="p-4 flex flex-col items-center text-center">
          <MessageSquare className="h-8 w-8 mb-2" />
          <h3 className="font-semibold">Discussions</h3>
          <p className="text-2xl font-bold text-primary">89</p>
        </Card>

        <Card className="p-4 flex flex-col items-center text-center">
          <Book className="h-8 w-8 mb-2" />
          <h3 className="font-semibold">Resources</h3>
          <p className="text-2xl font-bold text-primary">156</p>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Discussions</h2>
        <ScrollArea className="h-[400px] rounded-md border p-4">
          {discussions.map((discussion, index) => (
            <Card key={index} className="p-4 mb-4 last:mb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{discussion.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Posted by {discussion.author}
                  </p>
                </div>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                  {discussion.category}
                </span>
              </div>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4 mr-1" />
                {discussion.replies} replies
              </div>
            </Card>
          ))}
        </ScrollArea>
      </div>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Chat with Us</h2>
        <div className="space-y-4">
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} {...message} />
              ))}
            </div>
          </ScrollArea>
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </Card>
    </div>
  );
};