import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Bot, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    {
      text: "Hi! I'm your ADHD Learning Assistant. I can help you make the most of our tools and provide study tips. Would you like help with: \n1. Using the Pomodoro Timer for focused study\n2. Creating effective mind maps\n3. Managing tasks and deadlines\n4. Setting up a distraction-free workspace\n5. Using color overlays for reading",
      isUser: false
    }
  ]);
  const { toast } = useToast();

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { text: input, isUser: true }]);
    setInput("");
    
    // ADHD-specific responses based on common keywords
    setTimeout(() => {
      const adhd_responses = {
        pomodoro: "For ADHD learners, I recommend starting with shorter Pomodoro sessions - try 15 minutes of focus, then a 5-minute break. Use our timer to:\n- Set shorter intervals at first\n- Gradually increase duration as you build focus\n- Use the break to move around\n- Track your best focus times",
        
        mindmap: "Mind mapping is great for ADHD brains! Try these tips with our mind map tool:\n- Start with a central idea\n- Use different colors for different types of information\n- Keep branches short and clear\n- Add visual cues and symbols\n- Break complex topics into smaller chunks",
        
        task: "Let's make task management work for you! Our task planner helps by:\n- Breaking big tasks into smaller steps\n- Using color coding for priority\n- Setting realistic deadlines\n- Celebrating completed tasks with points\n- Sending gentle reminders",
        
        focus: "Create a distraction-free zone using our focus mode:\n- Enable the focus overlay\n- Use noise-canceling if available\n- Try different color overlays for comfort\n- Keep your workspace visually clean\n- Take regular movement breaks",
        
        reading: "Make reading easier with our tools:\n- Try the bionic reader for better focus\n- Use the color overlay to reduce visual stress\n- Break text into smaller chunks\n- Use text-to-speech for difficult passages\n- Take notes using the mind map",
        
        default: "Here are some general ADHD-friendly study tips:\n1. Use our Pomodoro timer for focused work\n2. Break tasks into smaller chunks in the task planner\n3. Try different color overlays for reading comfort\n4. Create visual mind maps for better understanding\n5. Enable focus mode during study sessions\n\nWhat specific area would you like help with?"
      };
      
      const lowercaseInput = input.toLowerCase();
      let response = adhd_responses.default;
      
      if (lowercaseInput.includes('pomodoro') || lowercaseInput.includes('timer')) {
        response = adhd_responses.pomodoro;
      } else if (lowercaseInput.includes('mind map') || lowercaseInput.includes('mindmap')) {
        response = adhd_responses.mindmap;
      } else if (lowercaseInput.includes('task') || lowercaseInput.includes('deadline')) {
        response = adhd_responses.task;
      } else if (lowercaseInput.includes('focus') || lowercaseInput.includes('distract')) {
        response = adhd_responses.focus;
      } else if (lowercaseInput.includes('read') || lowercaseInput.includes('text')) {
        response = adhd_responses.reading;
      }
      
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 1000);

    toast({
      title: "Message sent",
      description: "The AI assistant will respond shortly",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Bot className="w-4 h-4" />
        <h3 className="font-medium">ADHD Learning Assistant</h3>
      </div>
      <div className="bg-card rounded-lg p-3 h-[300px] overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg ${
              msg.isUser
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-muted"
            } max-w-[80%] ${msg.isUser ? "ml-auto" : "mr-auto"} whitespace-pre-line`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about study tips or how to use our tools..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};