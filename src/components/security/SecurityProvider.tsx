
import React, { createContext, useContext, useState } from 'react';
import { useAntiScreenCapture } from '@/hooks/useAntiScreenCapture';

interface SecurityContextType {
  enableAntiScreenCapture: boolean;
  toggleAntiScreenCapture: () => void;
}

const SecurityContext = createContext<SecurityContextType>({
  enableAntiScreenCapture: true,
  toggleAntiScreenCapture: () => {}
});

export const useSecurityContext = () => useContext(SecurityContext);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enableAntiScreenCapture, setEnableAntiScreenCapture] = useState<boolean>(true);

  // Use the anti-screen capture hook
  useAntiScreenCapture(enableAntiScreenCapture);

  const toggleAntiScreenCapture = () => setEnableAntiScreenCapture(prev => !prev);

  return (
    <SecurityContext.Provider 
      value={{
        enableAntiScreenCapture,
        toggleAntiScreenCapture
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};
