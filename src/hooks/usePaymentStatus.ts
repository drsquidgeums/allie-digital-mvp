import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PaymentStatus {
  hasPaid: boolean;
  isLoading: boolean;
  error: string | null;
}

export const usePaymentStatus = (userId: string | undefined) => {
  const [status, setStatus] = useState<PaymentStatus>({
    hasPaid: false,
    isLoading: true,
    error: null,
  });

  const checkPayment = useCallback(async () => {
    if (!userId) {
      setStatus({ hasPaid: false, isLoading: false, error: null });
      return;
    }

    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: null }));

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setStatus({ hasPaid: false, isLoading: false, error: null });
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
      });
    } catch (err: any) {
      console.error("Error checking payment:", err);
      setStatus({
        hasPaid: false,
        isLoading: false,
        error: err.message || "Failed to check payment status",
      });
    }
  }, [userId]);

  useEffect(() => {
    checkPayment();
  }, [checkPayment]);

  return { ...status, refetch: checkPayment };
};
