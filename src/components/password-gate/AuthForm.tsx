
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [paidEmail, setPaidEmail] = useState<string | null>(null);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { toast } = useToast();

  // Check if user just paid and came back
  useEffect(() => {
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

  const handleSignUpAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
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

    if (!acceptedTerms) {
      toast({
        title: "Error",
        description: "Please accept the Terms of Service and Privacy Policy.",
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
      // First, create the account
      const redirectUrl = `${window.location.origin}/`;
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (signUpError) {
        // Check if user already exists
        if (signUpError.message?.includes("User already registered")) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
          setIsSignIn(true);
          throw signUpError;
        }
        throw signUpError;
      }

      setProgress(50);

      // Store email and password temporarily for after payment
      localStorage.setItem("pending_signup_email", email);

      // Now redirect to Stripe payment
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { email },
      });

      if (error) throw error;

      if (data?.url) {
        setProgress(100);
        clearInterval(interval);

        toast({
          title: "Redirecting to payment",
          description: "Complete your payment to activate your account.",
        });

        // Store the email for post-payment verification
        localStorage.setItem("paid_email", email);
        
        // Open checkout in new tab
        window.open(data.url, "_blank");
        
        // Switch to sign-in mode with instructions
        setPaidEmail(email);
        setIsSignIn(true);
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      clearInterval(interval);
      setProgress(0);
      
      console.error("Signup/payment error:", error);
      
      if (!error.message?.includes("User already registered")) {
        toast({
          title: "Error",
          description: error.message || "Failed to process. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      clearInterval(interval);
    }
  };

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
        {paidEmail && (
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
          Don't have an account? Get Lifetime Access
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

  // Default: Sign Up + Pay Form (for new users)
  return (
    <div className="space-y-4 flex flex-col items-center">
      <div className="text-center mb-2">
        <p className="text-sm" style={{ color: '#666666' }}>
          One-time payment of <span className="font-bold">£30</span> for unlimited lifetime access
        </p>
      </div>
      
      <form onSubmit={handleSignUpAndPay} className="space-y-4 flex flex-col items-center w-full">
        <div className="w-[70%]">
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full transition-colors mb-3"
            style={{
              backgroundColor: 'white',
              color: '#000000',
              borderColor: '#d1d5db',
            }}
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full transition-colors"
            style={{
              backgroundColor: 'white',
              color: '#000000',
              borderColor: password && !isPasswordValid(password) ? '#ef4444' : '#d1d5db',
            }}
            disabled={isLoading}
          />
          <PasswordRequirements password={password} />
          
          <div className="flex items-start space-x-2 mt-4">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              className="h-3.5 w-3.5 shrink-0 rounded-sm border border-gray-400 data-[state=checked]:border-black"
              style={{
                borderColor: '#9ca3af',
                backgroundColor: acceptedTerms ? '#000000' : '#ffffff',
                marginTop: '1px',
              }}
              disabled={isLoading}
            />
            <label
              htmlFor="terms"
              className="text-xs leading-none cursor-pointer"
              style={{ color: '#666666' }}
            >
              I agree to the{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-70"
                style={{ color: '#000000' }}
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-70"
                style={{ color: '#000000' }}
              >
                Privacy Policy
              </a>
            </label>
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-[70%] transition-colors" 
          style={{
            backgroundColor: !isPasswordValid(password) || !email || !acceptedTerms ? '#9ca3af' : '#000000',
            color: '#ffffff',
            borderColor: !isPasswordValid(password) || !email || !acceptedTerms ? '#9ca3af' : '#000000',
            cursor: !isPasswordValid(password) || !email || !acceptedTerms ? 'not-allowed' : 'pointer',
          }}
          disabled={isLoading || !isPasswordValid(password) || !email || !acceptedTerms}
          onMouseEnter={(e) => {
            if (!isLoading && isPasswordValid(password) && email && acceptedTerms) {
              e.currentTarget.style.backgroundColor = '#1f1f1f';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && isPasswordValid(password) && email && acceptedTerms) {
              e.currentTarget.style.backgroundColor = '#000000';
            }
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Pay £30 for Lifetime Access"
          )}
        </Button>
      </form>
      
      <p className="text-xs" style={{ color: '#9ca3af' }}>
        Secure payments with Stripe
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
