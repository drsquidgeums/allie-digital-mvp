import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PomodoroProvider } from "@/contexts/PomodoroContext";

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

export const AppProviders = React.memo(({ children }: AppProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <NextThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <PomodoroProvider>
          {children}
        </PomodoroProvider>
      </TooltipProvider>
    </NextThemeProvider>
  </QueryClientProvider>
));

AppProviders.displayName = "AppProviders";