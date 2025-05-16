
import React, { useState, useRef } from "react";
import { Dialog } from "@/components/ui/dialog/dialog-root";
import { DialogContent } from "@/components/ui/dialog/dialog-content";
import { DialogHeader } from "@/components/ui/dialog/dialog-header";
import { DialogTitle } from "@/components/ui/dialog/dialog-title";
import { DialogFooter } from "@/components/ui/dialog/dialog-footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { NdaText } from "./NdaText";
import { supabase } from "@/integrations/supabase/client";
import { DialogDescription } from "@/components/ui/dialog/dialog-description";
import { Volume2, Pause, Play } from "lucide-react";

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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { toast } = useToast();
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  const getNdaPlainText = () => {
    // Extract the plain text from the NDA for text-to-speech
    return `
      Non-Disclosure Agreement.
      Effective Date: May 16, 2025.
      
      1. CONFIDENTIALITY AGREEMENT
      This Non-Disclosure Agreement is entered into by and between Allie Digital Ltd 
      ("Disclosing Party") and you, the individual accessing this application ("Recipient").
      
      2. CONFIDENTIAL INFORMATION
      "Confidential Information" means any and all information disclosed to Recipient by the Disclosing 
      Party, either directly or indirectly, in writing, orally, or by inspection of tangible or intangible 
      objects, including but not limited to:
      - The application, its features, functionality, and user interface
      - Documents, content, and data accessible through the application
      - Technical specifications, algorithms, source code, and development plans
      - Business strategies, plans, and methods
      - User credentials and access methods
      
      3. RECIPIENT'S OBLIGATIONS
      Recipient agrees to:
      - Maintain the confidentiality of all Confidential Information
      - Not disclose any Confidential Information to any third party
      - Not use any Confidential Information for any purpose except to evaluate and use the application as intended
      - Not reverse engineer, decompile, or disassemble the application
      - Not share access credentials with any other person
      
      4. TERM
      The obligations of Recipient under this Agreement shall survive for a period of three years 
      from the date of disclosure of the Confidential Information.
      
      5. DIGITAL SIGNATURE
      By entering my name and email address and clicking "I Agree," I acknowledge that I am creating an 
      electronic signature that will have the same legal effect and enforceability as a handwritten signature.
      
      BY ACCESSING THIS APPLICATION, YOU ARE LEGALLY BOUND BY THE TERMS OF THIS AGREEMENT.
    `;
  };

  const handleToggleAudio = () => {
    if (isPlaying) {
      // Stop reading
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Start reading
      const speechText = getNdaPlainText();
      const utterance = new SpeechSynthesisUtterance(speechText);
      
      // Add event listener for when speech ends
      utterance.onend = () => {
        setIsPlaying(false);
      };

      // Find English voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Female')
      ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.rate = 0.9; // Slightly slower than normal
      speechSynthesisRef.current = utterance;
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);

      toast({
        title: isPlaying ? "Audio Stopped" : "Reading Agreement",
        description: isPlaying ? "Text-to-speech stopped" : "NDA agreement is being read aloud",
      });
    }
  };

  // Ensure speech synthesis is canceled when dialog closes
  React.useEffect(() => {
    return () => {
      if (isPlaying) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying]);

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleToggleAudio}
            className="absolute right-0 top-0"
            aria-label={isPlaying ? "Stop reading" : "Read agreement aloud"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
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
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address:</Label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agree"
                checked={isAgreeChecked}
                onChange={(e) => setIsAgreeChecked(e.target.checked)}
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
