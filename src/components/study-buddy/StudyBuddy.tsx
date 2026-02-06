import React, { useState, useEffect, useRef } from "react";
import { StudyBuddyToggle } from "./StudyBuddyToggle";
import { StudyBuddyChat } from "./StudyBuddyChat";
import { useStudyBuddy } from "@/hooks/useStudyBuddy";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { cn } from "@/lib/utils";

export const StudyBuddy: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage, clearMessages } = useStudyBuddy();
  const { completeChecklistItem, onboardingEnabled } = useOnboarding();
  const hasTrackedRef = useRef(false);

  // Track when user sends a message to study buddy
  useEffect(() => {
    if (!onboardingEnabled || hasTrackedRef.current) return;
    
    // Check if user has sent at least one message (messages array will have > 1 item)
    if (messages.length > 1 && messages.some(m => m.role === "user")) {
      hasTrackedRef.current = true;
      completeChecklistItem("use-study-buddy");
    }
  }, [messages, completeChecklistItem, onboardingEnabled]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Button */}
      <StudyBuddyToggle 
        isOpen={isOpen} 
        onToggle={handleToggle}
      />

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-40 w-96 h-[600px] transition-all duration-300",
          isOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
      >
        <StudyBuddyChat
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onClearMessages={clearMessages}
        />
      </div>
    </>
  );
};
