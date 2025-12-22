
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingProgress } from "./LoadingProgress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthFormProps {
  onAuthenticated: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);

    // Start progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      if (isSignUp) {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) {
          throw error;
        }

        setProgress(100);
        clearInterval(interval);
        
        toast({
          title: "Success",
          description: "Account created! Please check your email to verify your account, or sign in if email confirmation is disabled.",
        });
        
        // Try to sign in immediately (works if email confirmation is disabled)
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!signInError) {
          onAuthenticated();
        }
      } else {
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
      }
    } catch (error: any) {
      clearInterval(interval);
      setProgress(0);
      
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please check your email to confirm your account.";
      } else if (error.message?.includes("User already registered")) {
        errorMessage = "An account with this email already exists. Try signing in.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
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
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        {isLoading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}
      </Button>
      
      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-sm underline transition-colors"
        style={{ color: '#666666' }}
        disabled={isLoading}
      >
        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
      </button>
      
      <LoadingProgress isLoading={isLoading} progress={progress} />
    </form>
  );
};
