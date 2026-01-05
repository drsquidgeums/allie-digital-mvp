import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      
      if (!sessionId) {
        setError("No session ID found");
        setIsVerifying(false);
        return;
      }

      try {
        const { data, error: fnError } = await supabase.functions.invoke("verify-payment-session", {
          body: { sessionId },
        });

        if (fnError) throw fnError;

        if (data.success) {
          setIsVerified(true);
        } else {
          setError("Payment verification failed. Please contact support.");
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setError(err.message || "Failed to verify payment");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleContinue = () => {
    navigate("/");
  };

  if (isVerifying) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto" style={{ color: '#000000' }} />
          <p className="text-lg" style={{ color: '#6b7280' }}>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <p className="text-lg" style={{ color: '#ef4444' }}>{error}</p>
          <Button 
            onClick={() => navigate("/")} 
            variant="outline"
            style={{ borderColor: '#d1d5db', color: '#000000' }}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <CheckCircle className="h-16 w-16 mx-auto" style={{ color: '#22c55e' }} />
        <h1 className="text-2xl font-bold" style={{ color: '#000000' }}>Payment Successful!</h1>
        <p style={{ color: '#6b7280' }}>
          Thank you for your purchase. You now have lifetime access to all features.
        </p>
        <Button 
          onClick={handleContinue} 
          className="w-full"
          style={{ backgroundColor: '#000000', color: '#ffffff' }}
        >
          Continue to App
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
