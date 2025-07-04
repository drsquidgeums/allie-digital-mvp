
import { useCallback } from "react";

export const useDocumentAnalysis = () => {
  const analyzeDocument = useCallback(async (content: string): Promise<string> => {
    if (!content) {
      return "No document content available. Please upload or open a document first.";
    }

    return `I can provide several types of document analysis:\n\n**📋 Summary Options:**\n• Executive summary (key points only)\n• Detailed breakdown (section by section)\n• Concept map (themes and connections)\n\n**🔍 Analysis Types:**\n• Structure and organization\n• Main arguments and evidence\n• Key terminology and definitions\n• Action items and conclusions\n\n**✍️ Writing Feedback:**\n• Clarity and readability\n• Tone and style consistency\n• Grammar and flow suggestions\n\nWhich type of analysis would be most helpful for you?`;
  }, []);

  return { analyzeDocument };
};
