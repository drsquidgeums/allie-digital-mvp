
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Supports both Supabase reset link formats:
    // 1) Implicit flow tokens in hash (#access_token=...&type=recovery)
    // 2) PKCE/code flow (?code=...)
    const checkSession = async () => {
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

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters.",
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

      toast({
        title: "Password Updated",
        description: "Your password has been successfully reset. Please sign in with your new password.",
      });

      // Clear any hash/query params and redirect to home immediately
      window.location.href = window.location.origin;
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

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#000000' }}>Invalid or Expired Link</h1>
          <p className="mb-6" style={{ color: '#666666' }}>
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Button
            onClick={() => navigate("/")}
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
            }}
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
      <div className="w-full max-w-md p-8">
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
                borderColor: '#d1d5db',
              }}
              disabled={isLoading}
            />
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
                borderColor: '#d1d5db',
              }}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
            }}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
