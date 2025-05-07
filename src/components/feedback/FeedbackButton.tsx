
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { FeedbackDialog } from "./FeedbackDialog";
import { useAuth } from "@/components/auth/AuthProvider";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const [shouldPrompt, setShouldPrompt] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Check if we should show the feedback prompt
    const hasSubmittedFeedback = localStorage.getItem('feedbackSubmitted') === 'true';
    const lastPromptTime = localStorage.getItem('lastFeedbackPrompt');
    
    const shouldShowPrompt = () => {
      if (hasSubmittedFeedback) return false;
      
      if (!lastPromptTime) {
        // First visit with auth, schedule prompt for later
        const currentTime = new Date().getTime();
        localStorage.setItem('lastFeedbackPrompt', currentTime.toString());
        return false;
      }
      
      // Show prompt after 10 minutes of usage
      const timeDiff = new Date().getTime() - parseInt(lastPromptTime);
      return timeDiff > 10 * 60 * 1000; // 10 minutes in milliseconds
    };
    
    if (shouldShowPrompt()) {
      setShouldPrompt(true);
    }
  }, [user]);

  // Auto-open the dialog if it's time to prompt
  useEffect(() => {
    if (shouldPrompt) {
      const timer = setTimeout(() => {
        setOpen(true);
        setShouldPrompt(false);
        // Update the last prompt time
        localStorage.setItem('lastFeedbackPrompt', new Date().getTime().toString());
      }, 2000); // Small delay after component mounts
      
      return () => clearTimeout(timer);
    }
  }, [shouldPrompt]);

  if (!user) return null;

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        className="fixed bottom-6 right-6 z-50 shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => setOpen(true)}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Feedback
      </Button>
      <FeedbackDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
