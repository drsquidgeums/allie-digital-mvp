
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingProgress } from "./LoadingProgress";

interface PasswordFormProps {
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
  password,
  setPassword,
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Complete loading after 1.2 seconds
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
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full transition-colors"
          style={{
            backgroundColor: 'white',
            color: '#000000',
            borderColor: '#d1d5db',
          }}
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        className="w-[70%] transition-colors" 
        style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          borderColor: '#000000',
        }}
        disabled={isLoading}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#1f1f1f';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#000000';
          }
        }}
      >
        {isLoading ? "Loading..." : "Enter"}
      </Button>
      <LoadingProgress isLoading={isLoading} progress={progress} />
    </form>
  );
};
