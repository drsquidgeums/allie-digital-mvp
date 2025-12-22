
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
import { StudyBuddy } from "@/components/study-buddy/StudyBuddy";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

const PomodoroTaskListener = memo(() => {
  usePomodoroTaskListener();
  return null;
});

PomodoroTaskListener.displayName = "PomodoroTaskListener";

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);

  // Set up Supabase auth listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Update userInfo when user changes
        if (session?.user) {
          setUserInfo({
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || ''
          });
        } else {
          setUserInfo(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (session?.user) {
        setUserInfo({
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || ''
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthentication = () => {
    // This is now handled by the auth state change listener
  };

  const handleCloseFeedbackPrompt = () => {
    setShowFeedbackPrompt(false);
  };

  const handlePostponeFeedback = () => {
    setShowFeedbackPrompt(false);
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <AppProviders>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppProviders>
    );
  }

  if (!session) {
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
            
            {/* Feedback Prompt - Only show when manually triggered */}
            <FeedbackPrompt
              isOpen={showFeedbackPrompt}
              onClose={handleCloseFeedbackPrompt}
              onPostpone={handlePostponeFeedback}
              userInfo={userInfo}
            />
            
            {/* AI Study Buddy - NEW FEATURE */}
            <StudyBuddy />
          </div>
        </SecurityProvider>
      </AppProviders>
    </BrowserRouter>
  );
};

export default App;
