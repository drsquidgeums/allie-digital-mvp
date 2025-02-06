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

  // Create an array of stars with different rotations
  const stars = Array.from({ length: 8 }).map((_, index) => {
    const rotation = (index * 45) + "deg"; // Evenly space stars in a circle
    return (
      <div
        key={index}
        className="absolute w-2 h-2 bg-black rounded-full"
        style={{
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%)`,
          animation: "starburst 1.5s infinite",
          animationDelay: `${index * 0.2}s`,
          "--rotation": rotation
        } as React.CSSProperties}
      />
    );
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="w-full max-w-md space-y-8 p-8 relative">
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            {stars}
          </div>
          <h1 className="text-2xl font-bold mb-2 relative z-10">Welcome</h1>
          <p className="text-muted-foreground relative z-10">Please enter the password to continue</p>
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
            Enter Application
          </Button>
        </form>
      </div>
    </div>
  );
};