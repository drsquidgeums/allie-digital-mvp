import React, { createContext, useContext } from "react";

interface TrialContextType {
  trialActive: boolean;
  trialDaysRemaining: number | null;
}

const TrialContext = createContext<TrialContextType>({
  trialActive: false,
  trialDaysRemaining: null,
});

export const TrialProvider: React.FC<{
  trialActive: boolean;
  trialDaysRemaining: number | null;
  children: React.ReactNode;
}> = ({ trialActive, trialDaysRemaining, children }) => (
  <TrialContext.Provider value={{ trialActive, trialDaysRemaining }}>
    {children}
  </TrialContext.Provider>
);

export const useTrialStatus = () => useContext(TrialContext);
