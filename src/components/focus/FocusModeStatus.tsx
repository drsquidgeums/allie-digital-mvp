
import React from 'react';

interface FocusModeStatusProps {
  isActive: boolean;
}

export const FocusModeStatus: React.FC<FocusModeStatusProps> = ({ isActive }) => {
  return (
    <div 
      role="status" 
      aria-live="polite"
      className="sr-only"
    >
      {isActive ? "Focus mode is active" : "Focus mode is inactive"}
    </div>
  );
};
