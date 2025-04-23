
import React, { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import "@/i18n/config"; 
import { useTranslation } from "react-i18next";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: Infinity
    },
  },
});

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
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <PomodoroProvider>
            <LanguageInitializer />
            {children}
          </PomodoroProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </Suspense>
));

AppProviders.displayName = "AppProviders";
