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

  // Generate multiple star elements with different positions and animations
  const stars = Array.from({ length: 8 }).map((_, index) => (
    <div
      key={index}
      className="absolute w-1 h-1 bg-black rounded-full animate-pulse"
      style={{
        top: `${Math.random() * 60 + 20}%`,
        left: `${Math.random() * 60 + 20}%`,
        animationDelay: `${index * 0.2}s`,
        opacity: 0.3
      }}
    />
  ));

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {stars}
      <div className="w-full max-w-md space-y-8 p-8 relative">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome</h1>
          <p className="text-muted-foreground">Please enter the password to continue</p>
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