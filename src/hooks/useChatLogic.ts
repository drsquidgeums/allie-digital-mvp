
import { useState, useCallback } from "react";
import { SYSTEM_PROMPT, createOpenAICompletion } from "@/utils/openai";
import { toast } from "sonner";

interface Message {
  text: string;
  isUser: boolean;
}

const INITIAL_MESSAGE: Message = {
  text: "Hi! I'm Allie.ai, your virtual learning assistant. What can I help you with today?",
  isUser: false
};

export const useChatLogic = (documentContent?: string) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiRetries, setApiRetries] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);

  const getToolResponse = useCallback((input: string, docContent?: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (docContent && (lowerInput.includes("explain") || lowerInput.includes("what is") || lowerInput.includes("definition") || lowerInput.includes("mean"))) {
      return `I can help explain concepts from your document. Please specify which term or concept you'd like me to explain, or I can analyze the content and highlight key concepts for you.`;
    }
    
    if (lowerInput.includes("help") && lowerInput.includes("dyslexia") || lowerInput.includes("dyslexic")) {
      return "This application has several features designed specifically to help with dyslexia:\n\n• The Irlen Overlay tool adds colored backgrounds to text which can reduce visual stress\n• The OpenDyslexic font is specially designed with weighted bottoms to help prevent letter switching\n• The Bionic Reader highlights parts of words to improve focus and reading speed\n• The Text-to-Speech feature can read content aloud when reading becomes difficult\n\nYou can access these tools from the toolbar at the top of the document viewer. Would you like me to explain any of these features in more detail?";
    }
    
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
    
    if (lowerInput.includes("connection") || lowerInput.includes("error") || lowerInput.includes("not working") || lowerInput.includes("api") || lowerInput.includes("claude")) {
      return "I'm experiencing connection issues with my AI service. This could be due to API key limitations, CORS restrictions, or service outages. While we work on fixing this, I'll use my built-in knowledge to help you. You can still ask me about any of the application features!";
    }

    return "I can explain how our various tools help support different learning needs. You can ask about specific tools like the Irlen Overlay, OpenDyslexic font, Bionic Reader, Color Separator, Focus Mode, Pomodoro Timer, Mind Map, or Text-to-Speech feature. Which would you like to learn more about?";
  }, []);

  const analyzeDocument = useCallback(async (content: string): Promise<string> => {
    if (!content) {
      return "No document content available. Please upload or open a document first.";
    }

    try {
      // Skip API call if we're in fallback mode due to previous errors
      if (usingFallback) {
        return "I'm currently using my built-in knowledge only. I can help you break down this document into more manageable sections. Which part would you like to focus on first?";
      }

      const systemMessage = `${SYSTEM_PROMPT} You are analyzing document content for a student with learning differences. Identify 3-5 key concepts and provide simple explanations for each one.`;
      
      const messages = [
        { role: "system", content: systemMessage },
        { role: "user", content: `Analyze this document content and identify key concepts that might be difficult to understand: ${content.substring(0, 4000)}` }
      ];
      
      const responseContent = await createOpenAICompletion(messages);
      return responseContent || "I couldn't identify any complex concepts in this document.";
    } catch (error) {
      console.error("Error analyzing document:", error);
      toast.error("Error analyzing document. Using built-in analysis capabilities.");
      return "I encountered an error analyzing your document. Let me help you break it down into manageable sections instead. What specific part would you like to focus on first?";
    }
  }, [usingFallback]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput("");

    try {
      if (documentContent && input.toLowerCase().includes("analyze") && input.toLowerCase().includes("document")) {
        const response = await analyzeDocument(documentContent);
        setMessages(prev => [...prev, { text: response, isUser: false }]);
        setIsLoading(false);
        return;
      }
      
      // Skip API call if we've had multiple failures and use built-in responses instead
      if (usingFallback || apiRetries >= 3) {
        const fallbackResponse = getToolResponse(input, documentContent);
        setMessages(prev => [...prev, { text: fallbackResponse, isUser: false }]);
        setIsLoading(false);
        return;
      }
      
      // Try OpenAI API
      try {
        console.log("Attempting to get a response from OpenAI API...");
        
        const chatHistory = messages.map(msg => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text
        }));
        
        chatHistory.unshift({
          role: "system",
          content: SYSTEM_PROMPT
        });
        
        chatHistory.push({
          role: "user",
          content: input
        });
        
        const responseText = await createOpenAICompletion(chatHistory);
        setApiRetries(0); // Reset retries on successful call
        setUsingFallback(false); // Reset fallback mode on success
        setMessages(prev => [...prev, { text: responseText, isUser: false }]);
      } catch (error) {
        console.error("Error getting OpenAI response:", error);
        
        // Increment retry counter
        setApiRetries(prev => prev + 1);
        
        // After 3 retries, switch to fallback mode
        if (apiRetries >= 2) {
          setUsingFallback(true);
          toast.error("AI service unavailable. Using offline mode.", {
            description: "Using built-in responses until the service is restored."
          });
        } else {
          toast.error("Error connecting to AI service. Trying built-in responses.");
        }
        
        const fallbackResponse = getToolResponse(input, documentContent);
        setMessages(prev => [...prev, { text: fallbackResponse, isUser: false }]);
      }
    } catch (error) {
      console.error("Error in chat flow:", error);
      const fallbackResponse = getToolResponse(input, documentContent);
      setMessages(prev => [...prev, { text: fallbackResponse, isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, getToolResponse, analyzeDocument, documentContent, messages, apiRetries, usingFallback]);

  return {
    input,
    setInput,
    messages,
    setMessages,
    isLoading,
    handleSend,
    analyzeDocument,
    usingFallback
  };
};
