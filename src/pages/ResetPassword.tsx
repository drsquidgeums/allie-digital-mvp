
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PasswordRequirements, isPasswordValid } from "@/components/password-gate/PasswordRequirements";

const gatewayBackground = "/images/gateway-background.png";
const lovableLogo = "/images/lovable-logo.png";
const allieLogo = "/images/allie-digital-logo.png";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Supports both Supabase reset link formats:
    // 1) Implicit flow tokens in hash (#access_token=...&type=recovery)
    // 2) PKCE/code flow (?code=...)
    const checkSession = async () => {
      // If password was just reset successfully, show success state immediately
      if (localStorage.getItem("password_reset_success")) {
        setIsSuccess(true);
        setIsChecking(false);
        return;
      }

      try {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const searchParams = new URLSearchParams(window.location.search);

        const code = searchParams.get("code");
        const typeFromQuery = searchParams.get("type");
        const typeFromHash = hashParams.get("type");
        const type = typeFromQuery || typeFromHash;

        // PKCE/code exchange flow
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            setIsValidSession(true);
          }
          return;
        }

        // Legacy implicit flow (hash tokens)
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (type === "recovery" && accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            setIsValidSession(true);
          }
          return;
        }

        // Fallback: if a recovery session is already present
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setIsValidSession(true);
        }
      } catch (e) {
        // If anything fails, we keep isValidSession=false and show the invalid link UI
        console.error("Reset password session check failed", e);
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in both password fields.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!isPasswordValid(password)) {
      toast({
        title: "Error",
        description: "Password does not meet all requirements.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      // Sign out after password reset so user can sign in with new password
      await supabase.auth.signOut();
      
      // Clear any paid_email flag and set password reset success flag
      localStorage.removeItem("paid_email");
      localStorage.setItem("password_reset_success", "true");

      // Show success state
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleReturnToSignIn = () => {
    window.location.href = window.location.origin;
  };

  // Shared layout wrapper
  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div 
      className="min-h-screen flex flex-col items-center justify-between relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
      }}
    >
      {/* Background image - fixed position */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${gatewayBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.3,
          zIndex: 0,
        }}
      />
      
      {/* Logo - top right */}
      <div className="absolute top-6 right-6 z-10">
        <img src={allieLogo} alt="Allie Digital" className="h-[130px]" />
      </div>
      
      {/* Content */}
      <div className="max-w-md w-full relative z-10 flex-grow flex flex-col justify-center">
        {children}
      </div>
      
      {/* Footer */}
      <footer 
        className="text-center z-10 flex-shrink-0 mt-12"
        style={{ color: '#666666' }}
      >
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <span style={{ fontSize: '12px', lineHeight: 1 }}>Powered by</span>
          <img src={lovableLogo} alt="Lovable" className="h-3" style={{ display: 'inline-block' }} />
        </div>
        <span className="text-sm">© Allie Digital CIC 2026. Registered in Northern Ireland. Company No. NI718014 · Licensed under <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>AGPL v3</a></span>
      </footer>
    </div>
  );

  if (isChecking) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </PageWrapper>
    );
  }

  // Success state - password was reset successfully
  if (isSuccess) {
    return (
      <PageWrapper>
        <div className="text-center p-8">
          <div 
            className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#22c55e' }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#000000' }}>Password Successfully Reset</h1>
          <p className="mb-6" style={{ color: '#666666' }}>
            Your password has been updated. Please return to sign in to access your account with your new password.
          </p>
          <Button
            onClick={handleReturnToSignIn}
            className="w-full"
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
            }}
          >
            Return to Sign In
          </Button>
        </div>
      </PageWrapper>
    );
  }

  if (!isValidSession) {
    return (
      <PageWrapper>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#000000' }}>Invalid or Expired Link</h1>
          <p className="mb-6" style={{ color: '#666666' }}>
            This password reset link is invalid or has expired. Please request a new one from the sign in page.
          </p>
          <Button
            onClick={handleReturnToSignIn}
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
            }}
          >
            Back to Sign In
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="w-full p-8">
        <h1 className="text-2xl font-bold text-center mb-6" style={{ color: '#000000' }}>
          Set New Password
        </h1>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              style={{
                backgroundColor: 'white',
                color: '#000000',
                borderColor: password && !isPasswordValid(password) ? '#ef4444' : '#d1d5db',
              }}
              disabled={isLoading}
            />
            <PasswordRequirements password={password} />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
              style={{
                backgroundColor: 'white',
                color: '#000000',
                borderColor: confirmPassword && password !== confirmPassword ? '#ef4444' : '#d1d5db',
              }}
              disabled={isLoading}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                Passwords do not match
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            style={{
              backgroundColor: !isPasswordValid(password) || password !== confirmPassword ? '#9ca3af' : '#000000',
              color: '#ffffff',
              cursor: !isPasswordValid(password) || password !== confirmPassword ? 'not-allowed' : 'pointer',
            }}
            disabled={isLoading || !isPasswordValid(password) || password !== confirmPassword}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default ResetPassword;
