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

export const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  const requirements = validatePassword(password);
  const metCount = Object.values(requirements).filter(Boolean).length;
  
  if (metCount === 0) return { score: 0, label: "Too weak", color: "#ef4444" };
  if (metCount === 1) return { score: 20, label: "Weak", color: "#ef4444" };
  if (metCount === 2) return { score: 40, label: "Fair", color: "#f97316" };
  if (metCount === 3) return { score: 60, label: "Good", color: "#eab308" };
  if (metCount === 4) return { score: 80, label: "Strong", color: "#22c55e" };
  return { score: 100, label: "Excellent", color: "#16a34a" };
};

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const requirements = validatePassword(password);
  const strength = getPasswordStrength(password);
  
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
      {/* Password Strength Meter */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium" style={{ color: '#374151' }}>
            Password strength
          </span>
          <span 
            className="text-xs font-bold" 
            style={{ 
              color: strength.color,
              textShadow: '0 0 1px rgba(0,0,0,0.1)'
            }}
          >
            {strength.label}
          </span>
        </div>
        <div 
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: '#e5e7eb' }}
        >
          <div 
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${strength.score}%`,
              backgroundColor: strength.color,
            }}
          />
        </div>
      </div>

      <p className="text-xs font-medium mb-2" style={{ color: '#374151' }}>
        Requirements:
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
