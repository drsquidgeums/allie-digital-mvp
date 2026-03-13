
import React, { lazy, Suspense, memo, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AppProviders } from "@/components/app/AppProviders";
import { PasswordGate } from "@/components/PasswordGate";
import { AppRoutes } from "@/components/app/AppRoutes";
import { AppLogo } from "@/components/app/AppLogo";
import { usePomodoroTaskListener } from "@/hooks/usePomodoroTaskListener";

import { SecurityProvider } from "@/components/security/SecurityProvider";
import { StudyBuddy } from "@/components/study-buddy/StudyBuddy";
import { EmailVerificationReminder } from "@/components/auth/EmailVerificationReminder";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { PaymentRequiredGate } from "@/components/payment/PaymentRequiredGate";
import { TrialBanner } from "@/components/payment/TrialBanner";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCanceled from "@/pages/PaymentCanceled";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import OpenSourceLicense from "@/pages/OpenSourceLicense";
import { clearFiles as clearGlobalFiles } from "@/store/fileStore";
import { clearFiles as clearFileManagerFiles } from "@/hooks/file-manager/fileStore";
import { OnboardingTour, WelcomeModal } from "@/components/onboarding";

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

  const { hasPaid, isLoading: isCheckingPayment, refetch: refetchPayment, trialActive, trialDaysRemaining, trialExpired, subscriptionStatus } = usePaymentStatus(user?.id);

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
          
          // If user just signed in, check if they have a stored paid email match
          const storedPaidEmail = localStorage.getItem("paid_email");
          if (storedPaidEmail && session.user.email?.toLowerCase() === storedPaidEmail.toLowerCase()) {
            // Clear the stored email and refetch payment status
            localStorage.removeItem("paid_email");
            // Small delay to ensure the check-payment can find the Stripe record
            setTimeout(() => {
              refetchPayment();
            }, 1000);
          }
        } else {
          setUserInfo(null);
          // Clear all cached data when user signs out to prevent data leakage
          clearGlobalFiles();
          clearFileManagerFiles();
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
  }, [refetchPayment]);

  const handleAuthentication = () => {
    // This is now handled by the auth state change listener
  };

  const handlePaymentComplete = () => {
    refetchPayment();
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

  // Not authenticated - show unified auth/payment gate (unless dev bypass)
  // This single gate handles sign-up + payment and sign-in
  if (!session && !isDevBypass) {
    return (
      <BrowserRouter>
        <AppProviders>
          <Toaster />
          <Sonner />
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }
          >
            <Routes>
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-canceled" element={<PaymentCanceled />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/open-source-license" element={<OpenSourceLicense />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route
                path="/reset-password"
                element={React.createElement(React.lazy(() => import("@/pages/ResetPassword")))}
              />
              <Route path="*" element={<PasswordGate onAuthenticated={handleAuthentication} />} />
            </Routes>
          </Suspense>
        </AppProviders>
      </BrowserRouter>
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

  // Authenticated but hasn't paid and trial expired - show payment wall
  if (!isDevBypass && !hasPaid) {
    return (
      <BrowserRouter>
        <AppProviders>
          <Toaster />
          <Sonner />
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }
          >
            <Routes>
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-canceled" element={<PaymentCanceled />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/open-source-license" element={<OpenSourceLicense />} />
              <Route
                path="/reset-password"
                element={React.createElement(React.lazy(() => import("@/pages/ResetPassword")))}
              />
              <Route path="*" element={
                <PaymentRequiredGate 
                  onPaymentComplete={handlePaymentComplete} 
                  trialExpired={trialExpired}
                  userEmail={user?.email}
                />
              } />
            </Routes>
          </Suspense>
        </AppProviders>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <AppProviders>
        <Routes>
          {/* Reset password should render standalone, outside the main app layout */}
          <Route
            path="/reset-password"
            element={
              <Suspense fallback={
                <div className="flex items-center justify-center h-screen">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              }>
                {React.createElement(React.lazy(() => import("@/pages/ResetPassword")))}
              </Suspense>
            }
          />
          {/* Main app with layout */}
          <Route
            path="*"
            element={
              <SecurityProvider>
                <div className={`app-container ${trialActive ? 'pt-8' : ''}`}>
                  {trialActive && trialDaysRemaining !== null && (
                    <TrialBanner daysRemaining={trialDaysRemaining} />
                  )}
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
                  
                  {/* Onboarding Components */}
                  <WelcomeModal />
                  <OnboardingTour />
                </div>
              </SecurityProvider>
            }
          />
        </Routes>
      </AppProviders>
    </BrowserRouter>
  );
};

export default App;
