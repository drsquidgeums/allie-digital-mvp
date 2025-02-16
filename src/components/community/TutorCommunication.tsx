
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TutorCommunication = () => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!message.trim()) return;
    
    toast({
      title: "Message Sent",
      description: "Your tutor will respond to your question soon.",
    });
    
    setMessage("");
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Ask Your Tutor</h2>
      </div>
      
      <div className="space-y-4">
        <div className="bg-accent/50 p-3 rounded-lg">
          <p className="text-sm font-medium">Active Tutor: Ms. Thompson</p>
          <p className="text-xs text-muted-foreground">Usually responds within 2 hours</p>
        </div>

        <Textarea
          placeholder="Type your question here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px] dark:bg-[#333333] dark:border-white/20"
        />

        <Button onClick={handleSubmit} className="w-full">
          <Send className="h-4 w-4 mr-2" />
          Send Question
        </Button>
      </div>
    </Card>
  );
};

export default TutorCommunication;
