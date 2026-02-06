import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { EnhancedSecurityProvider } from "../security/EnhancedSecurityProvider";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <EnhancedSecurityProvider>
            <PomodoroProvider>
              <OnboardingProvider>
                {children}
              </OnboardingProvider>
            </PomodoroProvider>
          </EnhancedSecurityProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
