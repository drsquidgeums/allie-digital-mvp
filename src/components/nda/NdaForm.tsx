
import React, { useState } from "react";
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
  const { toast } = useToast();

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
        .insert([{ 
          name, 
          email, 
          ip_address: ipAddress,
          agreement_version: '1.0' 
        }]);

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
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              aria-required="true"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              aria-required="true"
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="agree"
            checked={isAgreeChecked}
            onCheckedChange={(checked) => setIsAgreeChecked(checked === true)}
            aria-required="true"
          />
          <Label htmlFor="agree" className="text-sm font-normal cursor-pointer">
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
  );
};
