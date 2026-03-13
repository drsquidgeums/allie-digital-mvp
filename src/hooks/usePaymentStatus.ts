import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PaymentStatus {
  hasPaid: boolean;
  isLoading: boolean;
  error: string | null;
  subscriptionStatus: string | null;
  trialActive: boolean;
  trialDaysRemaining: number | null;
  trialExpired: boolean;
}

export const usePaymentStatus = (userId: string | undefined) => {
  const [status, setStatus] = useState<PaymentStatus>({
    hasPaid: false,
    isLoading: true,
    error: null,
    subscriptionStatus: null,
    trialActive: false,
    trialDaysRemaining: null,
    trialExpired: false,
  });

  const checkPayment = useCallback(async () => {
    if (!userId) {
      setStatus({ hasPaid: false, isLoading: false, error: null, subscriptionStatus: null, trialActive: false, trialDaysRemaining: null, trialExpired: false });
      return;
    }

    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: null }));

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setStatus({ hasPaid: false, isLoading: false, error: null, subscriptionStatus: null, trialActive: false, trialDaysRemaining: null, trialExpired: false });
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-payment", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setStatus({
        hasPaid: data?.hasPaid || false,
        isLoading: false,
        error: null,
        subscriptionStatus: data?.subscriptionStatus || null,
        trialActive: data?.trialActive || false,
        trialDaysRemaining: data?.trialDaysRemaining ?? null,
        trialExpired: data?.trialExpired || false,
      });
    } catch (err: any) {
      console.error("Error checking payment:", err);
      setStatus({
        hasPaid: false,
        isLoading: false,
        error: err.message || "Failed to check payment status",
        subscriptionStatus: null,
        trialActive: false,
        trialDaysRemaining: null,
        trialExpired: false,
      });
    }
  }, [userId]);

  useEffect(() => {
    checkPayment();
  }, [checkPayment]);

  return { ...status, refetch: checkPayment };
};
