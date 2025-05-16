
import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog/dialog-root";
import { DialogContent } from "@/components/ui/dialog/dialog-content";
import { DialogHeader } from "@/components/ui/dialog/dialog-header";
import { DialogTitle } from "@/components/ui/dialog/dialog-title";
import { DialogFooter } from "@/components/ui/dialog/dialog-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { NdaText } from "./NdaText";
import { supabase } from "@/integrations/supabase/client";
import { DialogDescription } from "@/components/ui/dialog/dialog-description";

interface NdaAgreementProps {
  isOpen: boolean;
  onAgreementComplete: (name: string, email: string) => void;
}

export const NdaAgreement: React.FC<NdaAgreementProps> = ({
  isOpen,
  onAgreementComplete
}) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isAgreeChecked, setIsAgreeChecked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  // Direct state updates for input fields
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreeChecked(e.target.checked);
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !isAgreeChecked) {
      toast({
        title: "Error",
        description: "Please fill all fields and agree to the terms.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get client IP (will be server IP in this implementation)
      let ipAddress = "Not collected";
      
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
      } catch (error) {
        console.error("Could not fetch IP:", error);
      }

      // Insert agreement into Supabase
      const { error } = await supabase
        .from('nda_agreements')
        .insert([
          { 
            name, 
            email, 
            ip_address: ipAddress,
            agreement_version: '1.0' 
          }
        ]);

      if (error) {
        throw error;
      }

      // Save to localStorage
      localStorage.setItem("nda_agreement", JSON.stringify({
        name,
        email,
        agreed_at: new Date().toISOString(),
        agreement_version: '1.0'
      }));

      toast({
        title: "Agreement Recorded",
        description: "Thank you for agreeing to the NDA.",
      });

      // Call onAgreementComplete to proceed
      onAgreementComplete(name, email);

    } catch (error) {
      console.error("Error recording NDA agreement:", error);
      toast({
        title: "Error",
        description: "Could not record your agreement. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Non-Disclosure Agreement
          </DialogTitle>
          <DialogDescription>
            Please review and agree to our NDA before proceeding
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <NdaText />

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name:</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address:</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agree"
                checked={isAgreeChecked}
                onChange={handleAgreeChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                required
              />
              <Label htmlFor="agree" className="text-sm">
                I have read and agree to the terms of this Non-Disclosure Agreement
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting || !isAgreeChecked || !name || !email}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Processing..." : "I Agree"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
