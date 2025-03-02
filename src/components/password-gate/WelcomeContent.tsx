
import React from "react";
import { StarburstAnimation } from "./StarburstAnimation";
import { DustParticles } from "./DustParticles";

interface WelcomeContentProps {
  colors: string[];
}

export const WelcomeContent: React.FC<WelcomeContentProps> = ({ colors }) => {
  return (
    <div className="text-center relative p-6">
      <div className="absolute inset-0 flex items-center justify-center">
        <StarburstAnimation colors={colors} />
        <DustParticles colors={colors} />
      </div>
      <h1 className="text-3xl font-bold mb-3 relative z-20 text-black">Allie.ai</h1>
      <p className="text-black relative z-20 whitespace-nowrap text-lg">
        Please enter the password to access the Web Application
      </p>
    </div>
  );
};
