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
      console.log("No NDA agreement found, not showing feedback prompt");
      return;
    }
    
    let userEmail = '';
    let ndaCompletedAt = '';
    
    try {
      const parsedAgreement = JSON.parse(ndaAgreement);
      userEmail = parsedAgreement.email;
      ndaCompletedAt = parsedAgreement.agreed_at;
    } catch (error) {
      console.error("Error parsing NDA agreement:", error);
      return; // Exit if we can't parse the agreement
    }
    
    // Check if feedback was already submitted (skip for special user)
    const feedbackSubmitted = localStorage.getItem("feedback_submitted");
    if (feedbackSubmitted && userEmail !== SPECIAL_USER_EMAIL) {
      console.log("Feedback already submitted, not showing prompt");
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
        console.log("Feedback postponed, showing in:", Math.floor(remainingTime / 1000 / 60), "minutes");
        const timer = setTimeout(() => {
          setShowFeedbackPrompt(true);
        }, remainingTime);
        
        return () => clearTimeout(timer);
      }
      // Postpone period expired, continue with normal flow
    }
    
    // Use session start time (which gets reset after NDA completion)
    const sessionStartTime = localStorage.getItem("session_start_time");
    if (!sessionStartTime) {
      console.log("No session start time found");
      return;
    }
    
    const startTime = parseInt(sessionStartTime, 10);
    const now = Date.now();
    const timeElapsed = now - startTime;
    
    console.log("Time elapsed since NDA completion:", Math.floor(timeElapsed / 1000 / 60), "minutes");
    
    // If 15 minutes have already passed since NDA completion, show feedback prompt immediately
    if (timeElapsed >= FEEDBACK_PROMPT_DELAY) {
      console.log("15+ minutes elapsed since NDA completion, showing feedback prompt immediately");
      setShowFeedbackPrompt(true);
      return;
    }
    
    // Otherwise, set timer for remaining time
    const remainingTime = FEEDBACK_PROMPT_DELAY - timeElapsed;
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
