
import React from "react";
import { StarburstAnimation } from "./StarburstAnimation";
import { DustParticles } from "./DustParticles";

interface WelcomeContentProps {
  colors: string[];
}

export const WelcomeContent: React.FC<WelcomeContentProps> = ({ colors }) => {
  return (
    <div className="text-center relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <StarburstAnimation colors={colors} />
        <DustParticles colors={colors} />
      </div>
      <h1 className="text-2xl font-bold mb-2 relative z-20 text-[#1A1F2C] dark:text-white">Welcome</h1>
      <p className="text-[#1A1F2C] dark:text-white relative z-20 whitespace-nowrap">
        Please enter the password to access the Web Application
      </p>
    </div>
  );
};
