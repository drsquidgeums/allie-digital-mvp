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
      return;
    }
    
    let userEmail = '';
    
    try {
      const parsedAgreement = JSON.parse(ndaAgreement);
      userEmail = parsedAgreement.email;
    } catch (error) {
      console.error("Error parsing NDA agreement:", error);
      return; // Exit if we can't parse the agreement
    }
    
    // Check if feedback was already submitted (skip for special user)
    const feedbackSubmitted = localStorage.getItem("feedback_submitted");
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
    
    // Record session start time if not already set
    if (!localStorage.getItem("session_start_time")) {
      const currentTime = Date.now();
      localStorage.setItem("session_start_time", currentTime.toString());
      console.log("Session start time set:", new Date(currentTime).toISOString());
    }
    
    const sessionStartTime = parseInt(localStorage.getItem("session_start_time") || Date.now().toString(), 10);
    const now = Date.now();
    const timeElapsed = now - sessionStartTime;
    
    console.log("Time elapsed since session start:", Math.floor(timeElapsed / 1000 / 60), "minutes");
    
    // If 15 minutes have already passed, show feedback prompt immediately
    if (timeElapsed >= FEEDBACK_PROMPT_DELAY) {
      console.log("15+ minutes elapsed, showing feedback prompt immediately");
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
