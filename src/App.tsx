
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
import { FeedbackPrompt } from "@/components/community/FeedbackPrompt";
import { useFeedbackPrompt } from "@/hooks/useFeedbackPrompt";

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
  const [hasAgreedToNda, setHasAgreedToNda] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  
  const { 
    showFeedbackPrompt, 
    handleCloseFeedbackPrompt, 
    handlePostponeFeedback 
  } = useFeedbackPrompt();

  // Check if user has previously agreed to NDA
  useEffect(() => {
    const ndaAgreement = localStorage.getItem("nda_agreement");
    if (ndaAgreement) {
      try {
        const parsedAgreement = JSON.parse(ndaAgreement);
        setHasAgreedToNda(true);
        setUserInfo({
          name: parsedAgreement.name,
          email: parsedAgreement.email
        });
      } catch (error) {
        console.error("Error parsing NDA agreement:", error);
        localStorage.removeItem("nda_agreement");
      }
    }
  }, []);

  const handleNdaAgreementComplete = (name: string, email: string) => {
    setHasAgreedToNda(true);
    setUserInfo({ name, email });
  };

  if (!isAuthenticated) {
    return (
      <AppProviders>
        <Toaster />
        <Sonner />
        <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />
      </AppProviders>
    );
  }

  if (!hasAgreedToNda) {
    return (
      <AppProviders>
        <Toaster />
        <Sonner />
        <NdaAgreement 
          isOpen={true} 
          onAgreementComplete={handleNdaAgreementComplete} 
        />
      </AppProviders>
    );
  }

  return (
    <BrowserRouter>
      <AppProviders>
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
          
          {/* Feedback Prompt */}
          <FeedbackPrompt
            isOpen={showFeedbackPrompt}
            onClose={handleCloseFeedbackPrompt}
            onPostpone={handlePostponeFeedback}
            userInfo={userInfo}
          />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
};

export default App;
