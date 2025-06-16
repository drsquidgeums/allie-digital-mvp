
import React from "react";
import { StarburstAnimation } from "./StarburstAnimation";
import { DustParticles } from "./DustParticles";

interface WelcomeContentProps {
  colors: string[];
}

export const WelcomeContent: React.FC<WelcomeContentProps> = ({ colors }) => {
  return (
    <div 
      className="text-center relative p-6 text-black"
      role="region"
      aria-labelledby="welcome-heading"
      style={{
        backgroundColor: 'transparent !important',
        color: '#000000 !important',
      }}
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
        style={{ 
          color: '#000000 !important',
          textShadow: 'none !important',
          // Override any theme-based text color
          '--tw-text-opacity': '1 !important',
        }}
      >
        Allie.ai
      </h1>
      <p 
        className="relative z-20 whitespace-nowrap text-lg text-black"
        style={{ 
          color: '#000000 !important',
          textShadow: 'none !important',
          // Override any theme-based text color
          '--tw-text-opacity': '1 !important',
        }}
        aria-describedby="welcome-heading"
      >
        Please enter the password to access the Web Application
      </p>
    </div>
  );
};
