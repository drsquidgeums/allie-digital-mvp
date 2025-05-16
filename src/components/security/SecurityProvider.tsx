
import React, { createContext, useContext, useState } from 'react';
import { WatermarkOverlay } from './WatermarkOverlay';
import { useAntiScreenCapture } from '@/hooks/useAntiScreenCapture';

interface SecurityContextType {
  enableWatermark: boolean;
  enableAntiScreenCapture: boolean;
  toggleWatermark: () => void;
  toggleAntiScreenCapture: () => void;
}

const SecurityContext = createContext<SecurityContextType>({
  enableWatermark: true,
  enableAntiScreenCapture: true,
  toggleWatermark: () => {},
  toggleAntiScreenCapture: () => {}
});

export const useSecurityContext = () => useContext(SecurityContext);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enableWatermark, setEnableWatermark] = useState<boolean>(true);
  const [enableAntiScreenCapture, setEnableAntiScreenCapture] = useState<boolean>(true);

  // Use the anti-screen capture hook
  useAntiScreenCapture(enableAntiScreenCapture);

  const toggleWatermark = () => setEnableWatermark(prev => !prev);
  const toggleAntiScreenCapture = () => setEnableAntiScreenCapture(prev => !prev);

  return (
    <SecurityContext.Provider 
      value={{
        enableWatermark,
        enableAntiScreenCapture,
        toggleWatermark,
        toggleAntiScreenCapture
      }}
    >
      {children}
      <WatermarkOverlay isEnabled={enableWatermark} />
    </SecurityContext.Provider>
  );
};
