
import { useCallback } from "react";

export const useToolResponses = () => {
  const getToolResponse = useCallback((input: string, docContent?: string): string => {
    const lowerInput = input.toLowerCase();
    
    console.log("Generating tool response for input:", input);
    
    // Greeting responses
    if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
      return "Hello! I'm Allie, your AI learning assistant. I'm here to help you with document analysis, writing assistance, research, and using the tools in this learning workspace. What would you like help with today?";
    }
    
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

    // Tool help responses
    if (lowerInput.includes("tool") || lowerInput.includes("feature") || lowerInput.includes("how to use")) {
      return `I can help you use the tools in this learning workspace! Here are the available features:\n\n**📚 Learning Tools:**\n• **Pomodoro Timer** - Focus sessions with break reminders\n• **Mind Mapping** - Visual organization of ideas\n• **Task Management** - Track progress with points and rewards\n• **Document Viewer** - PDF highlighting and annotation\n• **Text Editor** - Rich text editing with formatting\n\n**♿ Accessibility Tools:**\n• **Irlen Overlay** - Colored backgrounds to reduce visual stress\n• **Bionic Reader** - Highlighted text for better focus\n• **Text-to-Speech** - Audio playback of content\n• **Font Options** - Including OpenDyslexic font\n\nWhich tool would you like to learn more about?`;
    }

    // Document-specific analysis
    if (docContent && (lowerInput.includes("explain") || lowerInput.includes("what is") || lowerInput.includes("definition") || lowerInput.includes("mean"))) {
      return `I can help explain concepts from your document. Here's what I can do:\n\n**Concept Explanation:**\n• Break down complex ideas into simpler terms\n• Provide context and background\n• Offer examples and analogies\n• Connect concepts to broader themes\n\nPlease specify which term or concept you'd like me to explain, or I can analyze the content and highlight key concepts for you.`;
    }
    
    // Accessibility-specific responses
    if (lowerInput.includes("help") && (lowerInput.includes("dyslexia") || lowerInput.includes("dyslexic"))) {
      return "This application has several features designed specifically to help with dyslexia:\n\n• **Irlen Overlay** - Adds colored backgrounds to text which can reduce visual stress\n• **OpenDyslexic Font** - Specially designed with weighted bottoms to help prevent letter switching\n• **Bionic Reader** - Highlights parts of words to improve focus and reading speed\n• **Text-to-Speech** - Can read content aloud when reading becomes difficult\n\nYou can access these tools from the toolbar. Would you like me to explain any of these features in more detail?";
    }
    
    // Study tips
    if (lowerInput.includes("study") || lowerInput.includes("learning") || lowerInput.includes("tips")) {
      return `Here are some effective study strategies I can help you with:\n\n**🎯 Focus Techniques:**\n• Use the Pomodoro Timer for 25-minute focused sessions\n• Try the Focus Mode to minimize distractions\n• Break large tasks into smaller, manageable chunks\n\n**📝 Organization Methods:**\n• Create mind maps to visualize connections\n• Use the task planner to track your progress\n• Organize notes with headings and bullet points\n\n**🧠 Learning Strategies:**\n• Summarize key concepts in your own words\n• Use the highlighting tools to mark important information\n• Review material regularly using spaced repetition\n\nWhat specific area of studying would you like help with?`;
    }
    
    // Default response with more personality
    return `Hi there! I'm Allie, your AI learning assistant. I can help you with:\n\n**📄 Document Work:**\n• Analyze and summarize documents\n• Extract key points and themes\n• Explain complex concepts\n\n**✍️ Writing Support:**\n• Check grammar and style\n• Improve clarity and flow\n• Suggest better word choices\n\n**🔍 Research Help:**\n• Find related topics and sources\n• Structure research questions\n• Identify knowledge gaps\n\n**🛠️ Tool Guidance:**\n• Learn how to use workspace features\n• Get study tips and strategies\n• Optimize your learning workflow\n\nWhat can I help you with today? Feel free to ask me anything or just tell me what you're working on!`;
  }, []);

  return { getToolResponse };
};
