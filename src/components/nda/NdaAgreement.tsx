
import React from "react";
import { Dialog } from "@/components/ui/dialog/dialog-root";
import { DialogContent } from "@/components/ui/dialog/dialog-content";
import { DialogHeader } from "@/components/ui/dialog/dialog-header";
import { DialogTitle } from "@/components/ui/dialog/dialog-title";
import { DialogDescription } from "@/components/ui/dialog/dialog-description";
import { NdaText } from "./NdaText";
import { VoiceReader } from "./VoiceReader";
import { NdaForm } from "./NdaForm";
import { getNdaPlainText } from "./utils/textUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

interface NdaAgreementProps {
  isOpen: boolean;
  onAgreementComplete: (name: string, email: string) => void;
}

export const NdaAgreement: React.FC<NdaAgreementProps> = ({
  isOpen,
  onAgreementComplete
}) => {
  return (
    <Dialog open={isOpen} modal aria-labelledby="nda-dialog-title" aria-describedby="nda-dialog-description">
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <VoiceReader text={getNdaPlainText()} />
          <DialogTitle className="text-xl font-bold" id="nda-dialog-title">
            Non-Disclosure Agreement
          </DialogTitle>
          <DialogDescription id="nda-dialog-description">
            Please review and agree to our NDA before proceeding
          </DialogDescription>
        </DialogHeader>

        <Alert className="mb-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-300">
            This application employs security measures to prevent screenshots and screen recordings in compliance with the NDA. Attempts to capture content will be detected and logged.
          </AlertDescription>
        </Alert>
        
        <div 
          className="my-4 max-h-[40vh] overflow-y-auto border rounded-md p-4 bg-background/50" 
          aria-label="NDA agreement text" 
          role="region"
        >
          <NdaText />
        </div>
        
        <NdaForm onSubmitSuccess={onAgreementComplete} />
      </DialogContent>
    </Dialog>
  );
};
