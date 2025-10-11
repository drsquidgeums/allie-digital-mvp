
import React, { Suspense, memo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "@/components/app/AppProviders";
import { AppRoutes } from "@/components/app/AppRoutes";
import { AppLogo } from "@/components/app/AppLogo";
import { usePomodoroTaskListener } from "@/hooks/usePomodoroTaskListener";
import { SecurityProvider } from "@/components/security/SecurityProvider";
import { StudyBuddy } from "@/components/study-buddy/StudyBuddy";
import { AuthProvider } from "@/contexts/AuthContext";

const PomodoroTaskListener = memo(() => {
  usePomodoroTaskListener();
  return null;
});

PomodoroTaskListener.displayName = "PomodoroTaskListener";

const App = () => {
  return (
    <BrowserRouter>
      <AppProviders>
        <AuthProvider>
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
              
              {/* AI Study Buddy */}
              <StudyBuddy />
            </div>
          </SecurityProvider>
        </AuthProvider>
      </AppProviders>
    </BrowserRouter>
  );
};

export default App;
