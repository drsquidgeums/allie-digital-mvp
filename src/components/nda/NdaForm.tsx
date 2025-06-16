import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog/dialog-footer";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SecureInput } from "@/components/security/SecureInput";
import { emailSchema, nameSchema, checkRateLimit } from "@/utils/inputValidation";

interface NdaFormProps {
  onSubmitSuccess: (name: string, email: string) => void;
}

export const NdaForm: React.FC<NdaFormProps> = ({ onSubmitSuccess }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isAgreeChecked, setIsAgreeChecked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{name?: string; email?: string}>({});
  const { toast } = useToast();

  // Prefill form with existing data from localStorage if available
  useEffect(() => {
    const ndaAgreement = localStorage.getItem("nda_agreement");
    if (ndaAgreement) {
      try {
        const parsedAgreement = JSON.parse(ndaAgreement);
        setName(parsedAgreement.name || "");
        setEmail(parsedAgreement.email || "");
      } catch (error) {
        console.error("Error parsing NDA agreement:", error);
      }
    }
  }, []);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: {name?: string; email?: string} = {};
    
    try {
      nameSchema.parse(name);
    } catch (error: any) {
      errors.name = error.errors[0]?.message || "Invalid name";
    }
    
    try {
      emailSchema.parse(email);
    } catch (error: any) {
      errors.email = error.errors[0]?.message || "Invalid email";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting check
    const clientId = `nda_${Date.now()}`;
    if (!checkRateLimit(clientId, 3, 300000)) { // 3 attempts per 5 minutes
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again.",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm() || !isAgreeChecked) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields correctly and agree to the terms.",
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
        .insert([{ 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          ip_address: ipAddress,
          agreement_version: '1.0' 
        }]);

      if (error) {
        console.error("Supabase error:", error);
        throw new Error("Database error occurred");
      }

      // Save to localStorage
      localStorage.setItem("nda_agreement", JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        agreed_at: new Date().toISOString(),
        agreement_version: '1.0'
      }));

      // Reset session start time to now (when NDA is completed)
      const currentTime = Date.now();
      localStorage.setItem("session_start_time", currentTime.toString());
      console.log("Session start time reset after NDA completion:", new Date(currentTime).toISOString());

      toast({
        title: "Agreement Recorded",
        description: "Thank you for agreeing to the NDA.",
      });

      // Call onSubmitSuccess to proceed
      onSubmitSuccess(name.trim(), email.trim().toLowerCase());

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
    <form onSubmit={handleSubmit} className="space-y-6 pt-4" aria-labelledby="nda-form-title">
      <h3 className="sr-only" id="nda-form-title">NDA Agreement Form</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <SecureInput
              id="name"
              type="text"
              value={name}
              onSecureChange={setName}
              placeholder="Enter your full name"
              required
              maxLength={100}
              aria-required="true"
              aria-invalid={validationErrors.name ? "true" : undefined}
              className="w-full"
              style={{ color: "#000000", backgroundColor: "white" }}
            />
            {validationErrors.name && (
              <p className="text-sm text-red-500">{validationErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <SecureInput
              id="email"
              type="email"
              value={email}
              onSecureChange={setEmail}
              placeholder="Enter your email"
              required
              maxLength={254}
              aria-required="true"
              aria-invalid={validationErrors.email ? "true" : undefined}
              className="w-full"
              style={{ color: "#000000", backgroundColor: "white" }}
            />
            {validationErrors.email && (
              <p className="text-sm text-red-500">{validationErrors.email}</p>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="agree"
            checked={isAgreeChecked}
            onCheckedChange={(checked) => setIsAgreeChecked(checked === true)}
            aria-required="true"
            aria-describedby="agree-description"
            className="mt-1"
          />
          <Label htmlFor="agree" className="text-sm font-normal cursor-pointer" id="agree-description">
            I agree to the terms and conditions of this Non-Disclosure Agreement for this session
          </Label>
        </div>
      </div>

      <DialogFooter>
        <Button 
          type="submit" 
          disabled={isSubmitting || !isAgreeChecked || !name || !email}
          className="w-full sm:w-auto"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "I Agree"}
        </Button>
      </DialogFooter>
    </form>
  );
};
