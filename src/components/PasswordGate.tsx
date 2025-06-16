
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
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300"
      style={{
        opacity: imagesLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        backgroundImage: "url('/lovable-uploads/c6d002da-1686-4204-97e5-213169f7c0b5.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div 
        className="absolute inset-0 bg-white/94 dark:bg-gray-900/94 transition-colors duration-300" 
      />
      <div className="w-full max-w-xl space-y-8 p-8 relative z-10">
        <WelcomeHeader colors={colors} />
        <PasswordForm 
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
        />
      </div>
      <footer className="absolute bottom-4 text-sm text-gray-600 dark:text-gray-400 z-10">
        © Allie Digital Ltd. All Rights Reserved 2025
      </footer>
    </div>
  );
};
