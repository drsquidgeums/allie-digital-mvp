import { useState, useCallback } from "react";
import { SYSTEM_PROMPT, createOpenAICompletion } from "@/utils/openai";
import { toast } from "sonner";

interface Message {
  text: string;
  isUser: boolean;
}

const INITIAL_MESSAGE: Message = {
  text: "Hi! I'm Allie.ai, your virtual learning assistant. I can help you with document analysis, writing assistance, and research. What can I help you with today?",
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
    
    // Document Analysis Features
    if (docContent && (lowerInput.includes("summarize") || lowerInput.includes("summary"))) {
      return `I can help summarize your document. Here's what I can extract from the content:\n\n**Key Points Analysis:**\n• Main themes and concepts\n• Important definitions or terms\n• Action items or conclusions\n• Structure and organization\n\nWould you like me to focus on a specific aspect of the document, or would you prefer a general summary?`;
    }
    
    if (docContent && (lowerInput.includes("extract") && (lowerInput.includes("key") || lowerInput.includes("points") || lowerInput.includes("highlights")))) {
      return `I can extract key points from your document. Here's what I can identify:\n\n**Key Information Extraction:**\n• Main arguments or thesis statements\n• Supporting evidence and examples\n• Important data or statistics\n• Conclusions and recommendations\n• Critical concepts or definitions\n\nPlease let me know which type of key points you'd like me to focus on.`;
    }
    
    // Writing Assistance Features
    if (lowerInput.includes("grammar") || lowerInput.includes("check") || lowerInput.includes("proofread")) {
      return `I can help with grammar checking and proofreading! Here's what I can assist with:\n\n**Writing Assistance:**\n• Grammar and punctuation correction\n• Sentence structure improvement\n• Clarity and readability enhancement\n• Tone and style suggestions\n• Word choice optimization\n\nPlease paste the text you'd like me to review, or if you have a document loaded, I can analyze that content.`;
    }
    
    if (lowerInput.includes("style") || lowerInput.includes("improve") || lowerInput.includes("rewrite")) {
      return `I can help improve your writing style! Here's what I can offer:\n\n**Style Improvements:**\n• Sentence variety and flow\n• Active vs. passive voice suggestions\n• Conciseness and clarity\n• Professional or academic tone adjustment\n• Readability optimization\n\nShare the text you'd like me to help improve, and I'll provide specific suggestions.`;
    }
    
    // Research Help Features
    if (lowerInput.includes("research") || lowerInput.includes("sources") || lowerInput.includes("references")) {
      return `I can help with research guidance! Here's how I can assist:\n\n**Research Assistance:**\n• Suggest related topics and keywords\n• Recommend types of sources to look for\n• Help structure research questions\n• Identify gaps in current information\n• Suggest research methodologies\n\nWhat topic are you researching, or what kind of sources do you need help finding?`;
    }
    
    if (lowerInput.includes("related") || lowerInput.includes("similar") || lowerInput.includes("connections")) {
      return `I can help you find connections and related information! Here's what I can do:\n\n**Connection Finding:**\n• Identify related concepts and themes\n• Suggest complementary topics\n• Find interdisciplinary connections\n• Recommend follow-up questions\n• Highlight knowledge gaps\n\nTell me about your current topic or share your document, and I'll help identify related areas to explore.`;
    }

    // Document-specific analysis
    if (docContent && (lowerInput.includes("explain") || lowerInput.includes("what is") || lowerInput.includes("definition") || lowerInput.includes("mean"))) {
      return `I can help explain concepts from your document. Here's what I can do:\n\n**Concept Explanation:**\n• Break down complex ideas into simpler terms\n• Provide context and background\n• Offer examples and analogies\n• Connect concepts to broader themes\n\nPlease specify which term or concept you'd like me to explain, or I can analyze the content and highlight key concepts for you.`;
    }
    
    // Existing tool responses...
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
    
    if (lowerInput.includes("connection") || lowerInput.includes("error") || lowerInput.includes("not working") || lowerInput.includes("api") || lowerInput.includes("openai") || lowerInput.includes("ai service")) {
      return "I'm experiencing connection issues with my AI service. This could be due to API key limitations, rate limits, or service outages. While we work on resolving this, I'll use my built-in knowledge to help you. You can still ask me about any of the application features!";
    }

    return "I'm here to help with document analysis, writing assistance, and research! You can ask me to:\n\n**Document Analysis:**\n• Summarize documents or extract key points\n• Explain complex concepts\n• Identify main themes\n\n**Writing Assistance:**\n• Check grammar and style\n• Improve clarity and flow\n• Suggest better word choices\n\n**Research Help:**\n• Find related topics and sources\n• Suggest research directions\n• Identify knowledge gaps\n\nWhat would you like help with today?";
  }, []);

  const analyzeDocument = useCallback(async (content: string): Promise<string> => {
    if (!content) {
      return "No document content available. Please upload or open a document first.";
    }

    // Enhanced document analysis with multiple options
    return `I can provide several types of document analysis:\n\n**📋 Summary Options:**\n• Executive summary (key points only)\n• Detailed breakdown (section by section)\n• Concept map (themes and connections)\n\n**🔍 Analysis Types:**\n• Structure and organization\n• Main arguments and evidence\n• Key terminology and definitions\n• Action items and conclusions\n\n**✍️ Writing Feedback:**\n• Clarity and readability\n• Tone and style consistency\n• Grammar and flow suggestions\n\nWhich type of analysis would be most helpful for you?`;
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput("");

    try {
      // Check for specific document analysis requests
      if (documentContent) {
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes("analyze") && lowerInput.includes("document")) {
          const response = await analyzeDocument(documentContent);
          setMessages(prev => [...prev, { text: response, isUser: false }]);
          setIsLoading(false);
          return;
        }
        
        // Handle specific writing assistance requests
        if (lowerInput.includes("check grammar") || lowerInput.includes("proofread")) {
          const response = "I can help check the grammar in your loaded document. Here's what I can review:\n\n• Sentence structure and clarity\n• Punctuation and capitalization\n• Word choice and flow\n• Consistency in style and tone\n\nWould you like me to analyze the entire document or focus on a specific section?";
          setMessages(prev => [...prev, { text: response, isUser: false }]);
          setIsLoading(false);
          return;
        }
      }
      
      // Always skip API for API-related queries or after authentication errors
      const skipAPITerms = ['api', 'key', 'token', 'auth', 'error', 'connection', 'quota', 'limit', 'invalid'];
      const shouldSkipAPI = usingFallback || 
                          apiRetries >= 1 || 
                          skipAPITerms.some(term => input.toLowerCase().includes(term));
      
      if (shouldSkipAPI) {
        // Use fallback response system instead of API
        const fallbackResponse = getToolResponse(input, documentContent);
        setMessages(prev => [...prev, { text: fallbackResponse, isUser: false }]);
        setIsLoading(false);
        return;
      }
      
      // Try OpenAI API if not skipping
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
        
        // Check if the response indicates an API issue
        if (responseText.includes("API") && responseText.includes("issue")) {
          throw new Error("API authentication issue detected in response");
        }
        
        setApiRetries(0); // Reset retries on successful call
        setUsingFallback(false); // Reset fallback mode on success
        setMessages(prev => [...prev, { text: responseText, isUser: false }]);
      } catch (error) {
        console.error("Error getting OpenAI response:", error);
        
        // After first error, switch to fallback mode permanently
        setUsingFallback(true);
        setApiRetries(prev => prev + 1);
        
        toast.error("Using built-in assistant responses", {
          description: "AI service unavailable - using offline mode"
        });
        
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
