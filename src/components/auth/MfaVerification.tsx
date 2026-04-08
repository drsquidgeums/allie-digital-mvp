
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Shield } from "lucide-react";

interface MfaVerificationProps {
  factorId: string;
  onVerified: () => void;
  onCancel: () => void;
}

export const MfaVerification: React.FC<MfaVerificationProps> = ({
  factorId,
  onVerified,
  onCancel,
}) => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code || code.length !== 6) {
      setError("Please enter a 6-digit code.");
      return;
    }

    setIsVerifying(true);

    try {
      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code,
      });

      if (verifyError) throw verifyError;

      toast({
        title: "Verified",
        description: "Two-factor authentication successful.",
      });

      onVerified();
    } catch (err: any) {
      const message =
        err.message?.includes("Invalid") || err.message?.includes("invalid")
          ? "Invalid code. Please try again."
          : err.message || "Verification failed. Please try again.";
      setError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col items-center text-center">
      <div
        className="rounded-full p-4 mx-auto"
        style={{ backgroundColor: "#f0f9ff" }}
      >
        <Shield className="h-12 w-12" style={{ color: "#3b82f6" }} />
      </div>

      <div>
        <h2
          className="text-xl font-bold mb-2"
          style={{ color: "#000000" }}
        >
          Two-Factor Authentication
        </h2>
        <p className="text-sm" style={{ color: "#666666" }}>
          Enter the 6-digit code from your authenticator app.
        </p>
      </div>

      <form
        onSubmit={handleVerify}
        className="space-y-4 flex flex-col items-center w-full"
      >
        {error && (
          <p
            className="text-sm font-medium w-[70%] text-center"
            style={{ color: "#b91c1c" }}
          >
            {error}
          </p>
        )}
        <div className="w-[70%]">
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(val);
              setError(null);
            }}
            className="w-full text-center text-2xl tracking-[0.5em] font-mono transition-colors"
            style={{
              backgroundColor: "white",
              color: "#000000",
              borderColor: error ? "#b91c1c" : "#d1d5db",
              letterSpacing: "0.5em",
            }}
            disabled={isVerifying}
            autoFocus
          />
        </div>

        <Button
          type="submit"
          className="w-[70%] transition-colors"
          style={{
            backgroundColor: code.length !== 6 ? "#9ca3af" : "#000000",
            color: "#ffffff",
            cursor: code.length !== 6 ? "not-allowed" : "pointer",
          }}
          disabled={isVerifying || code.length !== 6}
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </form>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onCancel();
        }}
        className="text-sm underline transition-colors hover:opacity-70"
      >
        Sign in with a different account
      </a>
    </div>
  );
};
