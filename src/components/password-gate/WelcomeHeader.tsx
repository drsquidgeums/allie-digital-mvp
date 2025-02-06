import React from "react";
import { StarburstAnimation } from "./StarburstAnimation";

interface WelcomeHeaderProps {
  colors: string[];
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ colors }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <img 
        src="/lovable-uploads/3a3ef3bc-dbfb-441c-88cd-8b91d4891d61.png" 
        alt="Allie Digital Logo" 
        className="w-24 h-24 mb-6"
        style={{ opacity: 1 }}
        loading="eager"
      />
      <div className="text-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <StarburstAnimation colors={colors} />
        </div>
        <h1 className="text-2xl font-bold mb-2 relative z-10">Welcome</h1>
        <p className="text-muted-foreground relative z-10 whitespace-nowrap">
          Please enter the password to access the Web Application
        </p>
      </div>
    </div>
  );
};