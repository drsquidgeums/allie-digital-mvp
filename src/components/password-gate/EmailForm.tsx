
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingProgress } from "./LoadingProgress";

interface EmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({
  email,
  setEmail,
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
      setProgress(0);
      onSubmit(e);
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
      <div className="w-[70%]">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white text-black placeholder:text-black/60 focus:ring-2 focus:ring-black focus:border-black transition-colors"
          disabled={isLoading}
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-[70%] bg-black hover:bg-neutral-800 text-white transition-colors" 
        disabled={isLoading}
      >
        {isLoading ? "Checking..." : "Enter"}
      </Button>
      <LoadingProgress isLoading={isLoading} progress={progress} />
    </form>
  );
};
