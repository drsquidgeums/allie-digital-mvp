
import React, { lazy, Suspense, memo, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
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
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { PaymentRequiredGate } from "@/components/payment/PaymentRequiredGate";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCanceled from "@/pages/PaymentCanceled";

const PomodoroTaskListener = memo(() => {
  usePomodoroTaskListener();
  return null;
});

PomodoroTaskListener.displayName = "PomodoroTaskListener";

// Development bypass for Lovable preview environment
const isDevBypass = window.location.hostname.includes('lovableproject.com') || 
                    window.location.hostname.includes('lovable.app') ||
                    window.location.hostname === 'localhost';

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);

  const { hasPaid, isLoading: isCheckingPayment, refetch: refetchPayment } = usePaymentStatus(user?.id);

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

  const handlePaymentComplete = () => {
    refetchPayment();
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

  // Not authenticated - show login gate (unless dev bypass)
  if (!session && !isDevBypass) {
    return (
      <AppProviders>
        <Toaster />
        <Sonner />
        <PasswordGate onAuthenticated={handleAuthentication} />
      </AppProviders>
    );
  }

  // Authenticated but checking payment status (skip if dev bypass)
  if (!isDevBypass && isCheckingPayment) {
    return (
      <AppProviders>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppProviders>
    );
  }

  // Authenticated but hasn't paid - show payment gate (skip if dev bypass)
  // But allow access to payment success/canceled pages
  if (!isDevBypass && !hasPaid) {
    return (
      <BrowserRouter>
        <AppProviders>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-canceled" element={<PaymentCanceled />} />
            <Route path="*" element={<PaymentRequiredGate onPaymentComplete={handlePaymentComplete} />} />
          </Routes>
        </AppProviders>
      </BrowserRouter>
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
