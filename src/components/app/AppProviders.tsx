
import React, { Suspense, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import "@/i18n/config"; 
import { useTranslation } from "react-i18next";

// Create new query client using the correct import
import { createQueryClient } from "./queryClient";
const queryClient = createQueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

// Language initializer component to set document language
const LanguageInitializer = () => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // Set document language attribute when the app mounts
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language]);
  
  return null;
};

export const AppProviders = React.memo(({ children }: AppProvidersProps) => (
  <Suspense fallback="Loading...">
    <QueryClientProvider client={queryClient}>
      <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <PomodoroProvider>
            <LanguageInitializer />
            {children}
          </PomodoroProvider>
        </TooltipProvider>
      </NextThemeProvider>
    </QueryClientProvider>
  </Suspense>
));

AppProviders.displayName = "AppProviders";
