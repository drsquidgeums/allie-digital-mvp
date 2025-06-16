
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sanitizeHtml } from "@/utils/inputValidation";

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSecureChange?: (value: string) => void;
  maxLength?: number;
  allowHtml?: boolean;
}

interface SecureTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSecureChange?: (value: string) => void;
  maxLength?: number;
  allowHtml?: boolean;
}

export const SecureInput: React.FC<SecureInputProps> = ({ 
  onSecureChange, 
  maxLength = 1000,
  allowHtml = false,
  onChange,
  ...props 
}) => {
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Check length
    if (value.length > maxLength) {
      setError(`Maximum ${maxLength} characters allowed`);
      return;
    }
    
    // Sanitize if needed
    const sanitizedValue = allowHtml ? sanitizeHtml(value) : value;
    
    // Check for dangerous content
    if (containsDangerousContent(sanitizedValue)) {
      setError("Invalid content detected");
      return;
    }
    
    setError("");
    onSecureChange?.(sanitizedValue);
    onChange?.(e);
  };

  return (
    <div>
      <Input {...props} onChange={handleChange} />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export const SecureTextarea: React.FC<SecureTextareaProps> = ({ 
  onSecureChange, 
  maxLength = 2000,
  allowHtml = false,
  onChange,
  ...props 
}) => {
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Check length
    if (value.length > maxLength) {
      setError(`Maximum ${maxLength} characters allowed`);
      return;
    }
    
    // Sanitize if needed
    const sanitizedValue = allowHtml ? sanitizeHtml(value) : value;
    
    // Check for dangerous content
    if (containsDangerousContent(sanitizedValue)) {
      setError("Invalid content detected");
      return;
    }
    
    setError("");
    onSecureChange?.(sanitizedValue);
    onChange?.(e);
  };

  return (
    <div>
      <Textarea {...props} onChange={handleChange} />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

function containsDangerousContent(text: string): boolean {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(text));
}
