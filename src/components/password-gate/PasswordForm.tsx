import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  return (
    <form onSubmit={onSubmit} className="space-y-4 flex flex-col items-center">
      <div className="w-[70%]">
        <Input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-[70%]">
        Enter
      </Button>
    </form>
  );
};