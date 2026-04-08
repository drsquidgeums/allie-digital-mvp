
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, Loader2, CheckCircle, XCircle, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const MfaSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [isUnenrolling, setIsUnenrolling] = useState(false);

  useEffect(() => {
    checkMfaStatus();
  }, []);

  const checkMfaStatus = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      const verifiedFactor = data.totp.find((f) => f.status === "verified");
      if (verifiedFactor) {
        setIsEnrolled(true);
        setFactorId(verifiedFactor.id);
      } else {
        setIsEnrolled(false);
        setFactorId(null);
      }
    } catch (error) {
      console.error("Error checking MFA status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEnrollment = async () => {
    setIsEnrolling(true);
    setEnrollError(null);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Allie.ai Authenticator",
      });
      if (error) throw error;
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setFactorId(data.id);
    } catch (error: any) {
      console.error("MFA enrollment error:", error);
      toast({
        title: "Enrollment failed",
        description: error.message || "Failed to start MFA setup.",
        variant: "destructive",
      });
      setIsEnrolling(false);
    }
  };

  const handleVerifyEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollError(null);
    if (!verifyCode || verifyCode.length !== 6 || !factorId) {
      setEnrollError("Please enter a 6-digit code.");
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
        code: verifyCode,
      });
      if (verifyError) throw verifyError;
      setIsEnrolled(true);
      setIsEnrolling(false);
      setQrCode(null);
      setSecret(null);
      setVerifyCode("");
      toast({
        title: "MFA enabled",
        description: "Two-factor authentication is now active on your account.",
      });
    } catch (error: any) {
      const msg =
        error.message?.includes("Invalid") || error.message?.includes("invalid")
          ? "Invalid code. Please try again."
          : error.message || "Verification failed.";
      setEnrollError(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancelEnrollment = async () => {
    if (factorId && !isEnrolled) {
      try {
        await supabase.auth.mfa.unenroll({ factorId });
      } catch {}
    }
    setIsEnrolling(false);
    setQrCode(null);
    setSecret(null);
    setVerifyCode("");
    setEnrollError(null);
    if (!isEnrolled) setFactorId(null);
  };

  const handleUnenroll = async () => {
    if (!factorId) return;
    setIsUnenrolling(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;
      setIsEnrolled(false);
      setFactorId(null);
      toast({
        title: "MFA disabled",
        description: "Two-factor authentication has been removed from your account.",
      });
    } catch (error: any) {
      console.error("MFA unenroll error:", error);
      toast({
        title: "Failed to disable MFA",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUnenrolling(false);
    }
  };

  const copySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      toast({ title: "Copied", description: "Secret key copied to clipboard." });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
        <Separator />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        <div className="flex items-center gap-2">
          {isEnrolled ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/20 border-green-500/30">
                Enabled
              </Badge>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary">Disabled</Badge>
            </>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {isEnrolled
          ? "Your account is protected with an authenticator app. You'll need to enter a code from your app each time you sign in."
          : "Add an extra layer of security by requiring a code from an authenticator app (like Google Authenticator or Microsoft Authenticator) when signing in."}
      </p>

      <div className="flex gap-2">
        {isEnrolled ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                disabled={isUnenrolling}
              >
                {isUnenrolling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Disable MFA
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Disable Two-Factor Authentication?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove the extra security layer from your account.
                  You can re-enable it at any time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleUnenroll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, disable MFA
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartEnrollment}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            Enable MFA
          </Button>
        )}
      </div>

      {/* MFA Enrollment Dialog */}
      <Dialog open={isEnrolling && !!qrCode} onOpenChange={(open) => { if (!open) handleCancelEnrollment(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Set Up Two-Factor Authentication
            </DialogTitle>
            <DialogDescription>
              Scan the QR code below with your authenticator app (Google Authenticator, Microsoft Authenticator, etc.), then enter the 6-digit code to confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-xl border bg-white p-3">
                <img
                  src={qrCode!}
                  alt="MFA QR Code"
                  className="w-48 h-48"
                />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-xs text-muted-foreground">
                  Can't scan? Enter this key manually:
                </p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono break-all max-w-[220px]">
                    {secret}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copySecret}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <form onSubmit={handleVerifyEnrollment} className="space-y-3">
              <div>
                <Label className="text-sm">
                  Enter the 6-digit code from your app:
                </Label>
                {enrollError && (
                  <p className="text-sm text-destructive mt-1">{enrollError}</p>
                )}
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setVerifyCode(val);
                    setEnrollError(null);
                  }}
                  className="mt-2 text-center text-lg tracking-widest font-mono max-w-[200px] mx-auto"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEnrollment}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isVerifying || verifyCode.length !== 6}
                  className="gap-2"
                >
                  {isVerifying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Verify & Enable
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Separator />
    </div>
  );
};
