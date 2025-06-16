
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog/dialog-footer";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NdaFormProps {
  onSubmitSuccess: (name: string, email: string) => void;
}

export const NdaForm: React.FC<NdaFormProps> = ({ onSubmitSuccess }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isAgreeChecked, setIsAgreeChecked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
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
    let hasErrors = false;
    
    // Reset errors
    setNameError("");
    setEmailError("");

    if (!name.trim()) {
      setNameError("Full name is required");
      hasErrors = true;
    }

    if (!email.trim()) {
      setEmailError("Email address is required");
      hasErrors = true;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasErrors = true;
    }

    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !isAgreeChecked) {
      if (!isAgreeChecked) {
        toast({
          title: "Error",
          description: "Please agree to the terms and conditions.",
          variant: "destructive"
        });
      }
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
          name, 
          email, 
          ip_address: ipAddress,
          agreement_version: '1.0' 
        }]);

      if (error) {
        console.error("Supabase error:", error);
      }

      // Save to localStorage
      localStorage.setItem("nda_agreement", JSON.stringify({
        name,
        email,
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
      onSubmitSuccess(name, email);

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
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6 pt-4" aria-labelledby="nda-form-title" noValidate>
        <h3 
          className="text-xl font-semibold text-gray-900 dark:text-white mb-6" 
          id="nda-form-title"
        >
          Agreement Details
        </h3>
        
        <div className="space-y-6" role="group" aria-labelledby="nda-form-title">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <Label 
                htmlFor="name" 
                className="text-sm font-medium text-gray-900 dark:text-gray-100 block"
              >
                Full Name <span className="text-red-500" aria-label="required">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError("");
                }}
                placeholder="Enter your full name"
                required
                aria-required="true"
                aria-invalid={nameError ? "true" : "false"}
                aria-describedby={nameError ? "name-error" : undefined}
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              {nameError && (
                <div id="name-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {nameError}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label 
                htmlFor="email" 
                className="text-sm font-medium text-gray-900 dark:text-gray-100 block"
              >
                Email Address <span className="text-red-500" aria-label="required">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                placeholder="Enter your email"
                required
                aria-required="true"
                aria-invalid={emailError ? "true" : "false"}
                aria-describedby={emailError ? "email-error" : undefined}
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              {emailError && (
                <div id="email-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {emailError}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="agree"
                checked={isAgreeChecked}
                onCheckedChange={(checked) => setIsAgreeChecked(checked === true)}
                aria-required="true"
                aria-describedby="agree-description"
                className="mt-1 border-gray-400 dark:border-gray-500 data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-600 dark:data-[state=checked]:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
              />
              <Label 
                htmlFor="agree" 
                className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer leading-relaxed" 
                id="agree-description"
              >
                I agree to the terms and conditions of this Non-Disclosure Agreement for this session and acknowledge that I have read and understood all terms outlined above. <span className="text-red-500" aria-label="required">*</span>
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-6">
          <Button 
            type="submit" 
            disabled={isSubmitting || !isAgreeChecked || !name || !email}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 min-h-[44px]"
            aria-busy={isSubmitting}
            aria-describedby="submit-button-description"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing...</span>
              </span>
            ) : (
              "I Agree"
            )}
          </Button>
          <div id="submit-button-description" className="sr-only">
            Click to submit your agreement to the Non-Disclosure Agreement
          </div>
        </DialogFooter>
      </form>
    </div>
  );
};
