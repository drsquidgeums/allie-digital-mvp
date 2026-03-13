import React, { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const EmailVerificationReminder: React.FC = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const justSignedUp = sessionStorage.getItem("just_signed_up");
    if (!justSignedUp) return;

    // Clear immediately so it only shows once per signup
    sessionStorage.removeItem("just_signed_up");

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email || null);
        setShow(true);
      }
    });
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-xl shadow-2xl max-w-md w-[90%] p-6 relative animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-primary/10 rounded-full p-3">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-1">Welcome! Your trial has started 🎉</h2>
            <p className="text-muted-foreground text-sm">
              You have <span className="font-semibold text-foreground">7 days</span> of full access.
            </p>
          </div>

          {email && (
            <div className="bg-muted/50 rounded-lg px-4 py-3 w-full">
              <p className="text-sm text-muted-foreground mb-1">
                We sent a verification email to:
              </p>
              <p className="text-sm font-semibold break-all">{email}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Please check your inbox (and spam folder) to verify your email address.
          </p>

          <button
            onClick={() => setShow(false)}
            className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Got it, let's go!
          </button>
        </div>
      </div>
    </div>
  );
};
