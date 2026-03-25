import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Clock, Shield, Database, LogOut } from "lucide-react";
import stripeLogo from "@/assets/stripe-logo.png";
import { isSafeRedirectUrl } from "@/utils/sanitize";

interface PaymentGateProps {
  onPaymentComplete: () => void;
  userEmail?: string | null;
}

export const PaymentGate: React.FC<PaymentGateProps> = ({ onPaymentComplete, userEmail }) => {
  const [email, setEmail] = useState(userEmail || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { email },
      });

      if (error) throw error;

      if (data?.url && isSafeRedirectUrl(data.url)) {
        window.location.href = data.url;
      } else if (data?.url) {
        throw new Error("Unsafe redirect URL received");
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to start payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="space-y-6 text-center">
      {/* Header with icon */}
      <div className="space-y-3">
        <div className="flex justify-center">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#fef3c7' }}
          >
            <Clock className="w-6 h-6" style={{ color: '#d97706' }} />
          </div>
        </div>
        <h2 className="text-xl font-semibold">Your 7 Day Free Trial Has Ended</h2>
        <p className="text-sm" style={{ color: '#4b5563' }}>
          We hope you enjoyed exploring the app during your trial.
        </p>
      </div>

      {/* Feature cards */}
      <div className="flex flex-col gap-3 text-left w-[70%] mx-auto">
        <div 
          className="flex items-start gap-3 p-3 rounded-lg"
          style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
        >
          <Shield className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#000000' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: '#111827' }}>Lifetime access for just £30</p>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>One time payment, no subscriptions</p>
          </div>
        </div>
        <div 
          className="flex items-start gap-3 p-3 rounded-lg"
          style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
        >
          <Database className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#000000' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: '#111827' }}>Your data is safe</p>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>Everything you saved is waiting for you</p>
          </div>
        </div>
      </div>
      
      {/* Payment form */}
      <form onSubmit={handlePayment} className="space-y-4 flex flex-col items-center">
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
      
      {/* Footer */}
      <div className="space-y-3">
        <p className="text-xs flex items-center justify-center gap-1.5" style={{ color: '#6b7280' }}>
          <span>Secure payment powered by</span>
          <img src={stripeLogo} alt="Stripe" className="h-4" />
        </p>
        <p className="text-xs" style={{ color: '#9ca3af' }}>
          Please see our{' '}
          <a href="/terms" style={{ textDecoration: 'underline' }}>terms of service</a> for our policy on refunds.
        </p>
        
        {/* Sign out / back to sign in */}
        <button
          onClick={handleSignOut}
          className="text-sm underline transition-colors hover:opacity-70 flex items-center justify-center gap-1.5 mx-auto"
          style={{ color: '#6b7280' }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign in with a different account
        </button>
      </div>
    </div>
  );
};
