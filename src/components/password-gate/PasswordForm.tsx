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
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-[70%]" disabled={isLoading}>
        {isLoading ? "Loading..." : "Enter"}
      </Button>
      <LoadingProgress isLoading={isLoading} progress={progress} />
    </form>
  );
};