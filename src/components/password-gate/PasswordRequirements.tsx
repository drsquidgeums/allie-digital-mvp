import React from "react";
import { Check, X } from "lucide-react";

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface PasswordRequirementsProps {
  password: string;
}

export const validatePassword = (password: string) => {
  return {
    minLength: password.length >= 12,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
  };
};

export const isPasswordValid = (password: string): boolean => {
  const requirements = validatePassword(password);
  return Object.values(requirements).every(Boolean);
};

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const requirements = validatePassword(password);
  
  const requirementsList: PasswordRequirement[] = [
    { label: "At least 12 characters", met: requirements.minLength },
    { label: "One uppercase letter", met: requirements.hasUppercase },
    { label: "One lowercase letter", met: requirements.hasLowercase },
    { label: "One number", met: requirements.hasNumber },
    { label: "One symbol (!@#$%^&*...)", met: requirements.hasSymbol },
  ];

  // Only show if password has been started
  if (!password) return null;

  return (
    <div className="mt-2 p-3 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
      <p className="text-xs font-medium mb-2" style={{ color: '#374151' }}>
        Password requirements:
      </p>
      <ul className="space-y-1">
        {requirementsList.map((req, index) => (
          <li key={index} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="h-3 w-3" style={{ color: '#22c55e' }} />
            ) : (
              <X className="h-3 w-3" style={{ color: '#ef4444' }} />
            )}
            <span style={{ color: req.met ? '#22c55e' : '#6b7280' }}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
