
import { useState, useCallback } from "react";

interface Message {
  text: string;
  isUser: boolean;
}

const INITIAL_MESSAGE: Message = {
  text: "Hi! I'm Allie.ai, your virtual learning assistant. What can I help you with today?",
  isUser: false
};

export const useChatLogic = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const getToolResponse = useCallback((input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("irlen") || lowerInput.includes("overlay")) {
      return "The Irlen Overlay tool helps users with visual processing difficulties, including dyslexia. It adds a colored overlay to the screen which can reduce visual stress and make text easier to read. You can choose from different colors to find what works best for you.";
    }
    
    if (lowerInput.includes("font") || lowerInput.includes("opendyslexic") || lowerInput.includes("dyslexic")) {
      return "The Font Customization tool includes the OpenDyslexic font, which is specifically designed to help users with dyslexia. Its unique letter shapes and weighted bottoms can increase readability and reduce letter switching.";
    }
    
    if (lowerInput.includes("bionic") || lowerInput.includes("reader")) {
      return "The Bionic Reader helps improve focus and reading speed by highlighting parts of words. This can be particularly helpful for users with ADHD or reading difficulties, making it easier to maintain attention while reading.";
    }
    
    if (lowerInput.includes("color") || lowerInput.includes("separator")) {
      return "The Colour Separator tool allows you to highlight different parts of text in various colours. This can help with organising information, making complex texts more manageable, and improving comprehension for users with learning differences.";
    }
    
    if (lowerInput.includes("focus") || lowerInput.includes("mode")) {
      return "Focus Mode helps minimize distractions by entering fullscreen and hiding unnecessary elements. This is particularly helpful for users with ADHD who need to concentrate on their work.";
    }
    
    if (lowerInput.includes("pomodoro") || lowerInput.includes("timer")) {
      return "The Pomodoro Timer helps break work into manageable chunks with regular breaks. This is especially useful for users with ADHD, as it helps maintain focus and prevents mental fatigue.";
    }
    
    if (lowerInput.includes("mind") || lowerInput.includes("map")) {
      return "The Mind Mapping tool helps visualize connections between ideas. This visual approach to organizing information can be particularly helpful for users with different learning styles or those who prefer visual processing.";
    }
    
    if (lowerInput.includes("text") && lowerInput.includes("speech")) {
      return "The Text-to-Speech feature reads text aloud, which is helpful for users with dyslexia, visual processing difficulties, or those who learn better through auditory input.";
    }

    return "I can explain how our various tools help support different learning needs. You can ask about specific tools like the Irlen Overlay, OpenDyslexic font, Bionic Reader, Color Separator, Focus Mode, Pomodoro Timer, Mind Map, or Text-to-Speech feature. Which would you like to learn more about?";
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput("");

    const response = getToolResponse(input);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsLoading(false);
    }, 1000);
  }, [input, isLoading, getToolResponse]);

  return {
    input,
    setInput,
    messages,
    isLoading,
    handleSend
  };
};
