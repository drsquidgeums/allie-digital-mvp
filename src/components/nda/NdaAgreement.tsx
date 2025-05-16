
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

interface NdaAgreementProps {
  isOpen: boolean;
  onAgreementComplete: (name: string, email: string) => void;
}

export const NdaAgreement: React.FC<NdaAgreementProps> = ({
  isOpen,
  onAgreementComplete
}) => {
  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <VoiceReader text={getNdaPlainText()} />
          <DialogTitle className="text-xl font-bold">
            Non-Disclosure Agreement
          </DialogTitle>
          <DialogDescription>
            Please review and agree to our NDA before proceeding
          </DialogDescription>
        </DialogHeader>

        <NdaText />
        
        <NdaForm onSubmitSuccess={onAgreementComplete} />
      </DialogContent>
    </Dialog>
  );
};
