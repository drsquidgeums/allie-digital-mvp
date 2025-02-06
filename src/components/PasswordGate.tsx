import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const DEMO_PASSWORD = "allie2024"; // In a real app, this would be stored securely

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

  // Create an array of stars with different colors - expanded with more vibrant colors
  const colors = [
    '#9b87f5', // Primary Purple
    '#D946EF', // Magenta Pink
    '#F97316', // Bright Orange
    '#FFA500', // Pure Orange
    '#32CD32', // Lime Green
    '#FFFF00', // Yellow
    '#FFD700', // Golden Yellow
    '#0EA5E9', // Ocean Blue
    '#1EAEDB', // Bright Blue
    '#33C3F0', // Sky Blue
    '#8B5CF6', // Vivid Purple
    '#0FA0CE', // Bright Blue
    '#7E69AB', // Secondary Purple
    '#6E59A5', // Tertiary Purple
  ];
  
  const stars = Array.from({ length: 14 }).map((_, index) => {
    const rotation = (index * (360/14)) + "deg"; // Evenly space stars in a circle
    
    return (
      <div
        key={index}
        className="absolute w-4 h-4 rounded-sm"
        style={{
          top: "calc(50% - 20px)", // Move up by 20px
          left: "50%",
          transform: `translate(-50%, -50%)`,
          backgroundColor: colors[index],
          opacity: "0.95", // Increased opacity to 95%
          clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)", // Star shape
          animation: "starburst 1.5s infinite",
          animationDelay: `${index * 0.2}s`,
          "--rotation": rotation,
        } as React.CSSProperties}
      />
    );
  });

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden"
      style={{
        backgroundImage: "url('/lovable-uploads/c6d002da-1686-4204-97e5-213169f7c0b5.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div 
        className="absolute inset-0" 
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} 
      />
      <div className="w-full max-w-xl space-y-8 p-8 relative">
        <div className="flex flex-col items-center justify-center mb-8">
          <img 
            src="/lovable-uploads/3a3ef3bc-dbfb-441c-88cd-8b91d4891d61.png" 
            alt="Allie Digital Logo" 
            className="w-24 h-24 mb-6"
          />
          <div className="text-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              {stars}
            </div>
            <h1 className="text-2xl font-bold mb-2 relative z-10">Welcome</h1>
            <p className="text-muted-foreground relative z-10 whitespace-nowrap">Please enter the password to access the Web Application</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            Enter
          </Button>
        </form>
      </div>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        © Allie Digital Ltd. All Rights Reserved 2025
      </footer>
    </div>
  );
};