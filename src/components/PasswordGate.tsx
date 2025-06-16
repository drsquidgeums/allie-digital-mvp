
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { WelcomeHeader } from "./password-gate/WelcomeHeader";
import { PasswordForm } from "./password-gate/PasswordForm";

const DEMO_PASSWORD = "allie2024";

interface PasswordGateProps {
  onAuthenticated: () => void;
}

export const PasswordGate = ({ onAuthenticated }: PasswordGateProps) => {
  const [password, setPassword] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEMO_PASSWORD) {
      localStorage.setItem("isAuthenticated", "true");
      onAuthenticated();
      toast({
        title: "Success",
        description: "Welcome to the application!",
      });
    } else {
      toast({
        title: "Error",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const colors = [
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF',
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF',
  ];

  useEffect(() => {
    const bgImage = new Image();
    const logoImage = new Image();
    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        setImagesLoaded(true);
      }
    };

    bgImage.onload = handleImageLoad;
    logoImage.onload = handleImageLoad;

    bgImage.src = '/lovable-uploads/c6d002da-1686-4204-97e5-213169f7c0b5.png';
    logoImage.src = '/lovable-uploads/3a3ef3bc-dbfb-441c-88cd-8b91d4891d61.png';
  }, []);

  return (
    <div 
      className="password-gate min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        opacity: imagesLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        backgroundColor: '#ffffff',
        color: '#000000',
        // Force complete isolation from theme system
        filter: 'none',
      }}
    >
      {/* Completely override any theme styles */}
      <style jsx>{`
        .password-gate,
        .password-gate *,
        .password-gate *:before,
        .password-gate *:after {
          color: #000000 !important;
          background-color: transparent !important;
          border-color: #d1d5db !important;
        }
        
        .password-gate {
          background-color: #ffffff !important;
        }
        
        .password-gate input {
          background-color: white !important;
          color: #000000 !important;
          border-color: #d1d5db !important;
        }
        
        .password-gate button {
          background-color: #000000 !important;
          color: #ffffff !important;
          border-color: #000000 !important;
        }
        
        .password-gate button:hover {
          background-color: #1f1f1f !important;
          color: #ffffff !important;
        }
        
        .password-gate h1,
        .password-gate h2,
        .password-gate h3,
        .password-gate p,
        .password-gate span,
        .password-gate div,
        .password-gate label {
          color: #000000 !important;
          text-shadow: none !important;
        }
      `}</style>
      
      <div 
        className="w-full max-w-xl space-y-8 p-8 relative z-10"
        style={{
          backgroundColor: 'transparent',
          color: '#000000',
        }}
      >
        <WelcomeHeader colors={colors} />
        <PasswordForm 
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
        />
      </div>
      <footer 
        className="absolute bottom-4 text-sm z-10" 
        style={{ 
          color: '#666666',
        }}
      >
        © Allie Digital Ltd. All Rights Reserved 2025
      </footer>
    </div>
  );
};
