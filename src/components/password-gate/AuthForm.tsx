
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LoadingProgress } from "./LoadingProgress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { PasswordRequirements, isPasswordValid } from "./PasswordRequirements";

interface AuthFormProps {
  onAuthenticated: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSignIn, setIsSignIn] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [paidEmail, setPaidEmail] = useState<string | null>(null);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpNotice, setSignUpNotice] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  // Check if user just paid and came back, or just reset their password
  useEffect(() => {
    // Check for password reset success first (takes priority)
    const resetSuccess = localStorage.getItem("password_reset_success");
    if (resetSuccess) {
      setPasswordResetSuccess(true);
      setIsSignIn(true);
      localStorage.removeItem("password_reset_success");
      return; // Don't check for paid email if password was just reset
    }
    
    const storedPaidEmail = localStorage.getItem("paid_email");
    if (storedPaidEmail) {
      setPaidEmail(storedPaidEmail);
      setEmail(storedPaidEmail);
      setIsSignIn(true); // Switch to sign in mode for returning paid users
    }
  }, []);

  const handleClearPaidEmail = () => {
    localStorage.removeItem("paid_email");
    setPaidEmail(null);
    setIsSignIn(false);
    setEmail("");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a link to reset your password.",
      });
      
      setIsForgotPassword(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    
    if (!email || !password) {
      setSignInError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
    }, 100);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setProgress(100);
      clearInterval(interval);
      
      toast({
        title: "Success",
        description: "Welcome back!",
      });
      
      onAuthenticated();
    } catch (error: any) {
      clearInterval(interval);
      setProgress(0);
      
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please check your email to confirm your account.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSignInError(errorMessage);
    } finally {
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  const handleSignUpForTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);
    setSignUpNotice(null);

    if (!email || !password) {
      const message = "Please enter both email and password.";
      setSignUpError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const message = "Please enter a valid email address.";
      setSignUpError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return;
    }

    if (!isPasswordValid(password)) {
      const message = "Password does not meet all requirements.";
      setSignUpError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
    }, 100);

    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data: signUpData, error: signUpResponseError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (signUpResponseError) {
        if (signUpResponseError.message?.includes("User already registered")) {
          setSignUpError("This email is already registered. Please sign in instead.");
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
          setIsSignIn(true);
          throw signUpResponseError;
        }
        throw signUpResponseError;
      }

      setProgress(100);
      clearInterval(interval);

      if (signUpData.session) {
        sessionStorage.setItem("just_signed_up", "true");
        toast({
          title: "Trial started",
          description: "Your 7-day free trial is now active.",
        });
        onAuthenticated();
        return;
      }

      // Email confirmation required — show the verify popup
      setProgress(100);
      setPassword("");
      setVerifyEmail(email);
      setResendCooldown(60);
      setShowVerifyPopup(true);
    } catch (error: any) {
      clearInterval(interval);
      setProgress(0);

      console.error("Signup/trial start error:", error);

      if (!error.message?.includes("User already registered")) {
        const isRateLimited =
          error?.status === 429 ||
          error?.code === "over_email_send_rate_limit" ||
          error?.message?.toLowerCase().includes("rate limit");

        const message = isRateLimited
          ? "Too many signup attempts right now. Please wait a minute and try again."
          : error.message || "Failed to process. Please try again.";

        setSignUpError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: verifyEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      toast({
        title: "Email Sent",
        description: "A new verification email has been sent.",
      });
      setResendCooldown(60);
    } catch (error: any) {
      const isRateLimited =
        error?.status === 429 ||
        error?.message?.toLowerCase().includes("rate limit");
      toast({
        title: "Error",
        description: isRateLimited
          ? "Please wait a bit before requesting another email."
          : error.message || "Failed to resend. Please try again.",
        variant: "destructive",
      });
      if (isRateLimited) setResendCooldown(60);
    } finally {
      setIsResending(false);
    }
  };

  // Email Verification Popup
  if (showVerifyPopup) {
    return (
      <div className="space-y-6 flex flex-col items-center text-center">
        <div 
          className="rounded-full p-4 mx-auto"
          style={{ backgroundColor: '#f0fdf4' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>Check your email!</h2>
          <p className="text-sm" style={{ color: '#666666' }}>
            We've sent a verification link to:
          </p>
          <p className="font-semibold mt-1 break-all" style={{ color: '#000000' }}>
            {verifyEmail}
          </p>
        </div>
        
        <div 
          className="w-[80%] rounded-lg p-4"
          style={{ backgroundColor: '#fffbeb', borderColor: '#fbbf24', border: '1px solid #fbbf24' }}
        >
          <p className="text-sm font-medium" style={{ color: '#92400e' }}>
            Click the link in the email to verify your account, then come back here and sign in to start your <span className="font-bold">7-day free trial</span>.
          </p>
        </div>
        
        <p className="text-xs" style={{ color: '#9ca3af' }}>
          Don't see it? Check your spam or junk folder.
        </p>

        <button
          type="button"
          onClick={handleResendVerification}
          disabled={resendCooldown > 0 || isResending}
          className="text-sm underline transition-colors hover:opacity-70 disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
          style={{ color: resendCooldown > 0 ? '#9ca3af' : '#000000' }}
        >
          {isResending
            ? "Sending..."
            : resendCooldown > 0
              ? `Resend available in ${resendCooldown}s`
              : "Resend verification email"}
        </button>
        
        <Button
          type="button"
          className="w-[70%] transition-colors bg-[#000000] text-[#ffffff] border-[#000000] hover:bg-[#1f1f1f]"
          onClick={() => {
            setShowVerifyPopup(false);
            setIsSignIn(true);
            setEmail(verifyEmail);
            setPassword("");
          }}
        >
          I've verified — Sign In
        </Button>
      </div>
    );
  }

  // Forgot Password Form
  if (isForgotPassword) {
    return (
      <form onSubmit={handleForgotPassword} className="space-y-4 flex flex-col items-center">
        <div className="w-[70%]">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full transition-colors"
            style={{
              backgroundColor: 'white',
              color: '#000000',
              borderColor: '#d1d5db',
            }}
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          className="w-[70%] transition-colors" 
          style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            borderColor: '#000000',
          }}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
        
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsForgotPassword(false);
          }}
          className="text-sm underline transition-colors hover:opacity-70"
        >
          Back to Sign In
        </a>
      </form>
    );
  }

  // Sign In Form (for existing users or after payment)
  if (isSignIn) {
    return (
      <div className="space-y-4 flex flex-col items-center">
        <p className="w-[70%] text-sm text-center" style={{ color: '#666666' }}>
          Enter your details below to sign in.
        </p>
        {passwordResetSuccess && (
          <div 
            className="w-[70%] p-4 rounded-lg border-2 text-center mb-2"
            style={{ 
              backgroundColor: '#f0fdf4', 
              borderColor: '#22c55e' 
            }}
          >
            <p className="font-semibold text-sm" style={{ color: '#166534' }}>
              ✓ Password successfully reset! Sign in below.
            </p>
          </div>
        )}
        
        {paidEmail && !passwordResetSuccess && (
          <div 
            className="w-[70%] p-4 rounded-lg border-2 text-center mb-2"
            style={{ 
              backgroundColor: '#f0fdf4', 
              borderColor: '#22c55e' 
            }}
          >
            <p className="font-semibold text-sm" style={{ color: '#166534' }}>
              ✓ Payment complete! Sign in to access the app.
            </p>
          </div>
        )}
        
        <form onSubmit={handleSignIn} className="space-y-4 flex flex-col items-center w-full">
          <div className="w-[70%]">
            {signInError && (
              <p 
                className="text-sm mb-3 text-center font-medium"
                style={{ color: '#b91c1c' }}
              >
                {signInError}
              </p>
            )}
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSignInError(null);
              }}
              className="w-full transition-colors mb-3"
              style={{
                backgroundColor: 'white',
                color: '#000000',
                borderColor: signInError ? '#b91c1c' : '#d1d5db',
              }}
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setSignInError(null);
              }}
              className="w-full transition-colors"
              style={{
                backgroundColor: 'white',
                color: '#000000',
                borderColor: signInError ? '#b91c1c' : '#d1d5db',
              }}
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-[70%] transition-colors" 
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
              borderColor: '#000000',
            }}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#1f1f1f';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#000000';
              }
            }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleClearPaidEmail();
          }}
          className="text-sm underline transition-colors hover:opacity-70"
        >
          Don't have an account? Start your 7-day free trial
        </a>
        
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsForgotPassword(true);
          }}
          className="text-sm underline transition-colors hover:opacity-70"
        >
          Forgot password?
        </a>
        
        <LoadingProgress isLoading={isLoading} progress={progress} />
      </div>
    );
  }

  // Default: Sign Up Form (starts 7-day trial for new users)
  return (
    <div className="space-y-4 flex flex-col items-center">
      {/* Info cards instead of plain text */}
      <div className="flex flex-col gap-3 text-left w-[85%] mx-auto mb-2">
        <div 
          className="flex items-start gap-3 p-3 rounded-lg"
          style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
          <div>
            <p className="text-sm font-medium" style={{ color: '#111827' }}>7 day free trial</p>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>No card required to get started</p>
          </div>
        </div>
        <div 
          className="flex items-start gap-3 p-3 rounded-lg"
          style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <div>
            <p className="text-sm font-medium" style={{ color: '#111827' }}>Lifetime access for £30</p>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>One time payment after your trial ends</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSignUpForTrial} className="space-y-4 flex flex-col items-center w-full">
        <div className="w-[70%]">
          {signUpNotice && (
            <p className="text-sm mb-3 text-center text-primary font-medium">{signUpNotice}</p>
          )}
          {signUpError && (
            <p className="text-sm mb-3 text-center text-destructive font-medium">{signUpError}</p>
          )}
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSignUpError(null);
            }}
            className="w-full transition-colors mb-3"
            style={{
              backgroundColor: 'white',
              color: '#000000',
              borderColor: signUpError ? '#b91c1c' : '#d1d5db',
            }}
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setSignUpError(null);
            }}
            className="w-full transition-colors"
            style={{
              backgroundColor: 'white',
              color: '#000000',
              borderColor: signUpError || (password && !isPasswordValid(password)) ? '#b91c1c' : '#d1d5db',
            }}
            disabled={isLoading}
          />
          <PasswordRequirements password={password} />
        </div>
        <Button
          type="submit"
          className="w-[70%] transition-colors"
          style={{
            backgroundColor: !isPasswordValid(password) || !email ? '#9ca3af' : '#000000',
            color: '#ffffff',
            borderColor: !isPasswordValid(password) || !email ? '#9ca3af' : '#000000',
            cursor: !isPasswordValid(password) || !email ? 'not-allowed' : 'pointer',
          }}
          disabled={isLoading || !isPasswordValid(password) || !email}
          onMouseEnter={(e) => {
            if (!isLoading && isPasswordValid(password) && email) {
              e.currentTarget.style.backgroundColor = '#1f1f1f';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && isPasswordValid(password) && email) {
              e.currentTarget.style.backgroundColor = '#000000';
            }
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Start 7 Day Free Trial"
          )}
        </Button>
      </form>
      
      <p className="text-xs" style={{ color: '#9ca3af' }}>
        Please see our{' '}
        <a href="/terms" className="underline hover:opacity-80">terms of service</a> for our policy on refunds.
      </p>
      
      <div className="flex items-center justify-center gap-8 mt-2">
        <a
          href="/terms"
          className="text-sm underline hover:opacity-70 transition-colors"
          style={{ color: '#000000' }}
        >
          Terms of Service
        </a>
        <a
          href="/privacy"
          className="text-sm underline hover:opacity-70 transition-colors"
          style={{ color: '#000000' }}
        >
          Privacy Policy
        </a>
        <a
          href="/open-source-license"
          className="text-sm underline hover:opacity-70 transition-colors"
          style={{ color: '#000000' }}
        >
          Open Source License
        </a>
      </div>
      
      <p className="text-sm" style={{ color: '#666666' }}>
        Need enterprise licensing?{' '}
        <a
          href="mailto:alliedigital@pm.me?subject=Enterprise%20Licensing%20Inquiry"
          className="underline hover:opacity-70 transition-colors"
          style={{ color: '#000000' }}
        >
          Contact us for pricing
        </a>
      </p>
      
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setIsSignIn(true);
        }}
        className="text-sm underline transition-colors hover:opacity-70"
      >
        Already have an account? Sign In
      </a>
      
      <LoadingProgress isLoading={isLoading} progress={progress} />
    </div>
  );
};
