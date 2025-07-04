
import { useState, useEffect } from "react";

// Completely disable automatic feedback prompts
export const useFeedbackPrompt = (disableAutoPrompt: boolean = true) => {
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState<boolean>(false);
  
  // Always disabled - no automatic prompts
  useEffect(() => {
    console.log("Automatic feedback prompts are disabled");
  }, []);
  
  const handleCloseFeedbackPrompt = () => {
    setShowFeedbackPrompt(false);
  };
  
  const handlePostponeFeedback = () => {
    setShowFeedbackPrompt(false);
  };
  
  const handleManualFeedbackOpen = () => {
    setShowFeedbackPrompt(true);
  };
  
  return {
    showFeedbackPrompt: false, // Always false
    handleCloseFeedbackPrompt,
    handlePostponeFeedback,
    handleManualFeedbackOpen,
  };
};
