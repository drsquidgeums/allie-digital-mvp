
import React, { lazy, Suspense, memo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Navigate } from "react-router-dom";
import { AppProviders } from "@/components/app/AppProviders";
import { PasswordGate } from "@/components/PasswordGate";
import { FloatingAIAssistant } from "@/components/chat/FloatingAIAssistant";
import { AppRoutes } from "@/components/app/AppRoutes";
import { AppLogo } from "@/components/app/AppLogo";
import { usePomodoroTaskListener } from "@/hooks/usePomodoroTaskListener";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { FeedbackButton } from "@/components/feedback/FeedbackButton";

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

  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  if (!isAuthenticated) {
    return (
      <AppProviders>
        <Toaster />
        <Sonner />
        <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />
      </AppProviders>
    );
  }

  return (
    <BrowserRouter>
      <AppProviders>
        <AuthProvider>
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
              <FeedbackButton />
            </Suspense>
            <FloatingAIAssistant />
          </div>
        </AuthProvider>
      </AppProviders>
    </BrowserRouter>
  );
};

export default App;
