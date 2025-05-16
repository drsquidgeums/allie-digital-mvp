
import { useState, useEffect } from "react";

// Time before showing feedback prompt in milliseconds (15 minutes)
const FEEDBACK_PROMPT_DELAY = 15 * 60 * 1000; 

// Time before showing feedback prompt again if postponed
const POSTPONE_DELAY = 15 * 60 * 1000;

export const useFeedbackPrompt = () => {
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if feedback was already submitted
    const feedbackSubmitted = localStorage.getItem("feedback_submitted");
    if (feedbackSubmitted) {
      // User already submitted feedback, don't show prompt
      return;
    }
    
    // Check if feedback was postponed
    const postponedUntil = localStorage.getItem("feedback_postponed_until");
    if (postponedUntil) {
      const postponedTime = parseInt(postponedUntil, 10);
      const now = Date.now();
      
      if (now < postponedTime) {
        // Still in postponed period, set timer for remaining time
        const remainingTime = postponedTime - now;
        const timer = setTimeout(() => {
          setShowFeedbackPrompt(true);
        }, remainingTime);
        
        return () => clearTimeout(timer);
      }
      // Postpone period expired, continue with normal flow
    }
    
    // Set timer to show feedback prompt after delay
    const timer = setTimeout(() => {
      setShowFeedbackPrompt(true);
    }, FEEDBACK_PROMPT_DELAY);
    
    // Record session start time if not already set
    if (!localStorage.getItem("session_start_time")) {
      localStorage.setItem("session_start_time", Date.now().toString());
    }
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleCloseFeedbackPrompt = () => {
    setShowFeedbackPrompt(false);
    
    // Record that user declined feedback
    localStorage.setItem("feedback_declined", "true");
  };
  
  const handlePostponeFeedback = () => {
    setShowFeedbackPrompt(false);
    
    // Set postpone time
    const postponeUntil = Date.now() + POSTPONE_DELAY;
    localStorage.setItem("feedback_postponed_until", postponeUntil.toString());
  };
  
  const handleManualFeedbackOpen = () => {
    setShowFeedbackPrompt(true);
  };
  
  return {
    showFeedbackPrompt,
    handleCloseFeedbackPrompt,
    handlePostponeFeedback,
    handleManualFeedbackOpen,
  };
};
