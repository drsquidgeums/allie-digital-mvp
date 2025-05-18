import { useState, useEffect } from "react";

// Time before showing feedback prompt in milliseconds (15 minutes)
const FEEDBACK_PROMPT_DELAY = 15 * 60 * 1000; 

// Time before showing feedback prompt again if postponed
const POSTPONE_DELAY = 15 * 60 * 1000;

// Special user email that can submit multiple times
const SPECIAL_USER_EMAIL = "antoinettecelinemarshall@gmail.com";

export const useFeedbackPrompt = () => {
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState<boolean>(false);
  
  useEffect(() => {
    // Get current user info from localStorage
    const ndaAgreement = localStorage.getItem("nda_agreement");
    
    // Don't show feedback prompt if NDA hasn't been completed yet
    if (!ndaAgreement) {
      console.log("NDA not completed yet, not showing feedback prompt");
      return;
    }

    // Check if the NDA has completed timestamp
    let ndaCompletedTime: number;
    try {
      const parsedAgreement = JSON.parse(ndaAgreement);
      const agreedAtStr = parsedAgreement.agreed_at;
      if (!agreedAtStr) {
        console.log("No agreed_at timestamp in NDA agreement");
        return;
      }
      ndaCompletedTime = new Date(agreedAtStr).getTime();
      
      if (isNaN(ndaCompletedTime)) {
        console.log("Invalid agreed_at timestamp in NDA agreement");
        return;
      }
    } catch (error) {
      console.error("Error parsing NDA agreement:", error);
      return; // Exit if we can't parse the agreement
    }
    
    // Check if feedback was already submitted
    const feedbackSubmitted = localStorage.getItem("feedback_submitted");
    const userEmail = JSON.parse(ndaAgreement).email;
    if (feedbackSubmitted && userEmail !== SPECIAL_USER_EMAIL) {
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
    
    // Calculate delay from NDA completion time
    const now = Date.now();
    const timeElapsedSinceNDA = now - ndaCompletedTime;
    
    // If user just agreed to NDA, start the timer from now
    if (timeElapsedSinceNDA < 60000) { // Less than a minute since NDA completion
      console.log("NDA just completed, setting feedback prompt timer for 15 minutes from now");
      const timer = setTimeout(() => {
        setShowFeedbackPrompt(true);
      }, FEEDBACK_PROMPT_DELAY);
      
      return () => clearTimeout(timer);
    }
    
    // If 15 minutes have already passed since NDA completion, show feedback prompt after a short delay
    if (timeElapsedSinceNDA >= FEEDBACK_PROMPT_DELAY) {
      console.log("15+ minutes already passed since NDA completion, showing feedback prompt soon");
      const timer = setTimeout(() => {
        setShowFeedbackPrompt(true);
      }, 5000); // Show after 5 seconds to give the app time to settle
      
      return () => clearTimeout(timer);
    }
    
    // Otherwise, set timer for remaining time from NDA completion
    const remainingTime = FEEDBACK_PROMPT_DELAY - timeElapsedSinceNDA;
    console.log("Showing feedback prompt in:", Math.floor(remainingTime / 1000 / 60), "minutes");
    
    // Set timer to show feedback prompt after delay
    const timer = setTimeout(() => {
      console.log("Feedback prompt timer triggered, showing prompt now");
      setShowFeedbackPrompt(true);
    }, remainingTime);
    
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
