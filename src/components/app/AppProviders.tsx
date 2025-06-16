import React from 'react';
import { QueryClient } from "react-query";
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { SecurityProvider } from "../security/SecurityProvider";
import { EnhancedSecurityProvider } from "../security/EnhancedSecurityProvider";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClient>
      <TooltipProvider>
        <SecurityProvider>
          <EnhancedSecurityProvider>
            {children}
          </EnhancedSecurityProvider>
        </SecurityProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClient>
  );
};
