
import React from "react";
import { StarburstAnimation } from "./StarburstAnimation";
import { DustParticles } from "./DustParticles";

interface WelcomeContentProps {
  colors: string[];
}

export const WelcomeContent: React.FC<WelcomeContentProps> = ({ colors }) => {
  return (
    <div 
      className="text-center relative p-6"
      role="region"
      aria-labelledby="welcome-heading"
    >
      <div 
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <StarburstAnimation colors={colors} />
        <DustParticles colors={colors} />
      </div>
      <h1 
        id="welcome-heading"
        className="text-3xl font-bold mb-3 relative z-20 text-black"
      >
        Allie.ai
      </h1>
      <p 
        className="text-black relative z-20 whitespace-nowrap text-lg"
        aria-describedby="welcome-heading"
      >
        Please enter the password to access the web application
      </p>
    </div>
  );
};
