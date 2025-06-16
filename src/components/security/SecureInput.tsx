
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sanitizeInput, detectXSS } from "@/utils/inputValidation";
import { toast } from "sonner";

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSecureChange: (value: string) => void;
  maxLength?: number;
}

interface SecureTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSecureChange: (value: string) => void;
  maxLength?: number;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  onSecureChange,
  maxLength = 1000,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Check for XSS attempts
    if (detectXSS(value)) {
      toast.error("Invalid input detected");
      return;
    }
    
    // Check length
    if (value.length > maxLength) {
      toast.error(`Input too long. Maximum ${maxLength} characters allowed.`);
      return;
    }
    
    // Sanitize and pass to parent
    const sanitized = sanitizeInput(value);
    onSecureChange(sanitized);
    
    // Call original onChange if provided
    if (onChange) {
      const syntheticEvent = { ...e, target: { ...e.target, value: sanitized } };
      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return <Input {...props} onChange={handleChange} />;
};

export const SecureTextarea: React.FC<SecureTextareaProps> = ({
  onSecureChange,
  maxLength = 5000,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Check for XSS attempts
    if (detectXSS(value)) {
      toast.error("Invalid input detected");
      return;
    }
    
    // Check length
    if (value.length > maxLength) {
      toast.error(`Input too long. Maximum ${maxLength} characters allowed.`);
      return;
    }
    
    // Sanitize and pass to parent
    const sanitized = sanitizeInput(value);
    onSecureChange(sanitized);
    
    // Call original onChange if provided
    if (onChange) {
      const syntheticEvent = { ...e, target: { ...e.target, value: sanitized } };
      onChange(syntheticEvent as React.ChangeEvent<HTMLTextAreaElement>);
    }
  };

  return <Textarea {...props} onChange={handleChange} />;
};
