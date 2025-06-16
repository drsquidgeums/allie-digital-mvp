
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { SecurityProvider } from "../security/SecurityProvider";
import { EnhancedSecurityProvider } from "../security/EnhancedSecurityProvider";
import { PomodoroProvider } from "@/contexts/PomodoroContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <SecurityProvider>
            <EnhancedSecurityProvider>
              <PomodoroProvider>
                {children}
              </PomodoroProvider>
            </EnhancedSecurityProvider>
          </SecurityProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
