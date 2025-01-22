import { useState } from "react";
import { supabase } from '@/utils/supabase';
import { createOpenAIClient } from '@/utils/openai';

interface Message {
  text: string;
  isUser: boolean;
}

const INITIAL_MESSAGE: Message = {
  text: "Hi! I'm your AI learning assistant. I can help you use our tools like the Pomodoro Timer, Mind Map, Reading tools, and Focus mode. What would you like to learn about?",
  isUser: false
};

const SYSTEM_PROMPT = `You are an AI learning assistant specializing in helping users with ADHD and dyslexia use a digital workspace. The workspace includes:

- Pomodoro Timer for focused study sessions with customizable work/break intervals
- Mind Mapping tool for visual learning and organizing thoughts
- Task Management system with points and rewards for motivation
- Reading tools including:
  - Irlen overlays for reducing visual stress
  - Bionic reader for improved focus
  - OpenDyslexic font option
  - Text-to-speech functionality
- Focus mode to reduce distractions

Provide clear, step-by-step guidance on using these tools. Break information into small, manageable chunks and use bullet points when possible. Keep responses friendly, encouraging, and focused on practical usage tips.

If users seem frustrated or overwhelmed, suggest breaking tasks into smaller steps and recommend specific tools that might help, like:
- Using the Pomodoro Timer for time management
- Creating a mind map to organize thoughts
- Enabling Focus mode to reduce distractions
- Using reading tools for better comprehension

Always maintain a supportive and understanding tone while providing concrete, actionable advice.`;

export const useChatLogic = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput("");

    try {
      const openai = await createOpenAIClient();
      
      if (!openai) {
        throw new Error('Failed to initialize OpenAI client');
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map(msg => ({
            role: msg.isUser ? "user" : "assistant",
            content: msg.text
          })),
          { role: "user", content: input }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const aiResponse = response.choices[0]?.message?.content || "I apologize, but I'm having trouble generating a response. Please try again.";
      
      setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
    } catch (error) {
      console.error('Error in AI response:', error);
      setMessages(prev => [...prev, { 
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    input,
    setInput,
    messages,
    isLoading,
    handleSend
  };
};