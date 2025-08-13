
import React, { lazy, Suspense, memo, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Navigate } from "react-router-dom";
import { AppProviders } from "@/components/app/AppProviders";
import { PasswordGate } from "@/components/PasswordGate";
import { AppRoutes } from "@/components/app/AppRoutes";
import { AppLogo } from "@/components/app/AppLogo";
import { usePomodoroTaskListener } from "@/hooks/usePomodoroTaskListener";
import { FeedbackPrompt } from "@/components/community/FeedbackPrompt";

import { SecurityProvider } from "@/components/security/SecurityProvider";
import { useSessionValidation } from "@/hooks/useSessionValidation";

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
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
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
      } catch (error) {
        console.error("Error parsing NDA agreement:", error);
        localStorage.removeItem("nda_agreement");
      }
    }
  }, []);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  const handleSessionInvalid = () => {
    setIsAuthenticated(false);
  };

  // Use session validation hook when authenticated
  useSessionValidation(handleSessionInvalid);

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
            
            {/* Quick Access Button for Live Sessions */}
            
            
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
