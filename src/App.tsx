
import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "@/components/app/AppProviders";
import { PasswordGate } from "@/components/PasswordGate";
import { FloatingAIAssistant } from "@/components/chat/FloatingAIAssistant";

// Lazy load components that aren't needed immediately
const AppRoutes = lazy(() => import("@/components/app/AppRoutes").then(module => ({
  default: module.AppRoutes
})));
const AppLogo = lazy(() => import("@/components/app/AppLogo").then(module => ({
  default: module.AppLogo
})));

const App = () => {
  // Reset authentication state on initial load
  React.useEffect(() => {
    localStorage.removeItem("isAuthenticated");
  }, []);

  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  if (!isAuthenticated) {
    return (
      <AppProviders>
        <Toaster />
        <Sonner />
        <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />
      </AppProviders>
    );
  }

  return (
    <BrowserRouter>
      <AppProviders>
        <div className="app-container">
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <AppLogo />
          </Suspense>
          <Toaster />
          <Sonner />
          <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          }>
            <AppRoutes />
          </Suspense>
          <FloatingAIAssistant />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
};

export default App;
