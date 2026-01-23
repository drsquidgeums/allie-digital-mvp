import React from "react";
import { WelcomeContent } from "./WelcomeContent";

interface WelcomeHeaderProps {
  colors: string[];
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ colors }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <img 
        src="/lovable-uploads/Allie.ai_OS_Logo_1_PNG.png" 
        alt="Allie Digital Logo" 
        className="w-24 h-24 mb-0"
        style={{ opacity: 1 }}
        loading="eager"
      />
      <WelcomeContent colors={colors} />
    </div>
  );
};