
import React, { PropsWithChildren } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Initialize QueryClient
const queryClient = new QueryClient();

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <TooltipProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </TooltipProvider>
      </NextThemeProvider>
    </QueryClientProvider>
  );
};
