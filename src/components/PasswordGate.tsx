import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { WelcomeHeader } from "./password-gate/WelcomeHeader";
import { PasswordForm } from "./password-gate/PasswordForm";

const DEMO_PASSWORD = "allie2024";

interface PasswordGateProps {
  onAuthenticated: () => void;
}

export const PasswordGate = ({ onAuthenticated }: PasswordGateProps) => {
  const [password, setPassword] = useState("");
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
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#8B00FF', // Violet
    '#FF0000', // Red (repeat for smooth transition)
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#8B00FF', // Violet
  ];

  // Preload the background image
  React.useEffect(() => {
    const bgImage = new Image();
    bgImage.src = '/lovable-uploads/c6d002da-1686-4204-97e5-213169f7c0b5.png';
    
    const logoImage = new Image();
    logoImage.src = '/lovable-uploads/3a3ef3bc-dbfb-441c-88cd-8b91d4891d61.png';
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden"
      style={{
        backgroundImage: "url('/lovable-uploads/c6d002da-1686-4204-97e5-213169f7c0b5.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 1
      }}
    >
      <div 
        className="absolute inset-0" 
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }} 
      />
      <div className="w-full max-w-xl space-y-8 p-8 relative">
        <WelcomeHeader colors={colors} />
        <PasswordForm 
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
        />
      </div>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        © Allie Digital Ltd. All Rights Reserved 2025
      </footer>
    </div>
  );
};