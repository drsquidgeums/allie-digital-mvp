import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import stripeLogo from "@/assets/stripe-logo.png";

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

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { email },
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect in same tab to avoid popup blockers
        window.location.href = data.url;
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

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Get Lifetime Access</h2>
        <p className="text-muted-foreground">
          One-time payment of <span className="font-bold">£30</span> for unlimited access
        </p>
      </div>
      
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
      
      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
        <span>Secure payment powered by</span>
        <img src={stripeLogo} alt="Stripe" className="h-4" />
      </p>
    </div>
  );
};
