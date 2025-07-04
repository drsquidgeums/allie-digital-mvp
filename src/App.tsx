
import React, { lazy, Suspense, memo, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Navigate } from "react-router-dom";
import { AppProviders } from "@/components/app/AppProviders";
import { PasswordGate } from "@/components/PasswordGate";
import { FloatingAIAssistant } from "@/components/chat/FloatingAIAssistant";
import { AppRoutes } from "@/components/app/AppRoutes";
import { AppLogo } from "@/components/app/AppLogo";
import { usePomodoroTaskListener } from "@/hooks/usePomodoroTaskListener";
import { NdaAgreement } from "@/components/nda/NdaAgreement";
import { FeedbackButton } from "@/components/community/FeedbackButton";
import { FeedbackPrompt } from "@/components/community/FeedbackPrompt";
import { SecurityProvider } from "@/components/security/SecurityProvider";

const PomodoroTaskListener = memo(() => {
  usePomodoroTaskListener();
  return null;
});

PomodoroTaskListener.displayName = "PomodoroTaskListener";

const App = () => {
  // Reset authentication state on initial load
  React.useEffect(() => {
    localStorage.removeItem("isAuthenticated");
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNda, setShowNda] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const [ndaCompleted, setNdaCompleted] = useState<boolean>(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);

  // Load any existing user info from localStorage
  useEffect(() => {
    const ndaAgreement = localStorage.getItem("nda_agreement");
    if (ndaAgreement) {
      try {
        const parsedAgreement = JSON.parse(ndaAgreement);
        setUserInfo({
          name: parsedAgreement.name,
          email: parsedAgreement.email
        });
        setNdaCompleted(true);
      } catch (error) {
        console.error("Error parsing NDA agreement:", error);
        localStorage.removeItem("nda_agreement");
      }
    }
  }, []);

  const handleNdaAgreementComplete = (name: string, email: string) => {
    setShowNda(false);
    setUserInfo({ name, email });
    setNdaCompleted(true);
  };

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    setShowNda(true); // Always show NDA after authentication
  };

  const handleFeedbackClick = () => {
    setShowFeedbackPrompt(true);
  };

  const handleCloseFeedbackPrompt = () => {
    setShowFeedbackPrompt(false);
  };

  const handlePostponeFeedback = () => {
    setShowFeedbackPrompt(false);
  };

  if (!isAuthenticated) {
    return (
      <AppProviders>
        <Toaster />
        <Sonner />
        <PasswordGate onAuthenticated={handleAuthentication} />
      </AppProviders>
    );
  }

  return (
    <BrowserRouter>
      <AppProviders>
        <SecurityProvider>
          <div className="app-container">
            <AppLogo />
            <Toaster />
            <Sonner />
            <Suspense fallback={
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }>
              <PomodoroTaskListener />
              <AppRoutes />
            </Suspense>
            <FloatingAIAssistant />
            
            {/* Feedback Button - Always visible when authenticated */}
            {ndaCompleted && (
              <div className="fixed bottom-4 left-4 z-50">
                <FeedbackButton onClick={handleFeedbackClick} />
              </div>
            )}
            
            {/* NDA Agreement - Show this first */}
            <NdaAgreement 
              isOpen={showNda} 
              onAgreementComplete={handleNdaAgreementComplete} 
            />
            
            {/* Feedback Prompt - Only show when manually triggered */}
            <FeedbackPrompt
              isOpen={showFeedbackPrompt}
              onClose={handleCloseFeedbackPrompt}
              onPostpone={handlePostponeFeedback}
              userInfo={userInfo}
            />
          </div>
        </SecurityProvider>
      </AppProviders>
    </BrowserRouter>
  );
};

export default App;
