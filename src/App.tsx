
import React, { lazy, Suspense, memo, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Navigate } from "react-router-dom";
import { AppProviders } from "@/components/app/AppProviders";
import { PasswordGate } from "@/components/PasswordGate";
import { FloatingAIAssistant } from "@/components/chat/FloatingAIAssistant";
import { AppRoutes } from "@/components/app/AppRoutes";
import { AppLogo } from "@/components/app/AppLogo";
import { usePomodoroTaskListener } from "@/hooks/usePomodoroTaskListener";
import { useFocusMode } from "@/hooks/useFocusMode";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

const PomodoroTaskListener = memo(() => {
  usePomodoroTaskListener();
  return null;
});

PomodoroTaskListener.displayName = "PomodoroTaskListener";

// Global focus mode exit button component
const FocusModeExitButton = () => {
  const { isFocusModeActive } = useFocusMode();
  
  if (!isFocusModeActive) return null;
  
  const handleExitFocusMode = () => {
    console.log("Exiting focus mode from global exit button");
    // First update localStorage directly to ensure immediate state change
    localStorage.setItem('focusModeActive', 'false');
    
    // Then dispatch the global exit event
    window.dispatchEvent(new CustomEvent('focusModeExit'));
    
    // Ensure the focusModeChanged event is also fired
    window.dispatchEvent(new CustomEvent('focusModeChanged', { 
      detail: { 
        active: false,
        settings: null
      } 
    }));
    
    toast("Focus mode deactivated");
  };
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        size="sm"
        variant="outline"
        className="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-full h-8 w-8 p-0 shadow-md"
        onClick={handleExitFocusMode}
        aria-label="Exit focus mode"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

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
            <FocusModeExitButton />
            <AppRoutes />
          </Suspense>
          <FloatingAIAssistant />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
};

export default App;
