import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import Index from "./pages/Index";
import { TaskDashboard } from "./components/dashboard/TaskDashboard";
import AIAssistant from "./pages/AIAssistant";
import MindMapDashboard from "./pages/MindMapDashboard";
import CommunityPage from "./pages/CommunityPage";
import SettingsPage from "./pages/SettingsPage";
import { PomodoroProvider } from "./contexts/PomodoroContext";
import { WorkspaceLayout } from "./components/WorkspaceLayout";

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

const AppRoutes = React.memo(() => (
  <Routes>
    <Route path="/" element={<WorkspaceLayout><Index /></WorkspaceLayout>} />
    <Route path="/file-uploader" element={<WorkspaceLayout><Index /></WorkspaceLayout>} />
    <Route path="/tasks" element={<WorkspaceLayout><TaskDashboard /></WorkspaceLayout>} />
    <Route path="/ai-assistant" element={<WorkspaceLayout><AIAssistant /></WorkspaceLayout>} />
    <Route path="/mind-map" element={<WorkspaceLayout><MindMapDashboard /></WorkspaceLayout>} />
    <Route path="/settings" element={<WorkspaceLayout><SettingsPage /></WorkspaceLayout>} />
    <Route path="/community" element={<WorkspaceLayout><CommunityPage /></WorkspaceLayout>} />
  </Routes>
));

AppRoutes.displayName = "AppRoutes";

const ProvidersWrapper = React.memo(({ children }: { children: React.ReactNode }) => (
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

ProvidersWrapper.displayName = "ProvidersWrapper";

const App = () => {
  React.useEffect(() => {
    const savedOverlay = localStorage.getItem('irlenOverlayColor');
    if (savedOverlay) {
      document.documentElement.style.setProperty('--overlay-color', savedOverlay);
      document.documentElement.style.setProperty('--overlay-display', 'block');
    }

    const style = document.createElement('style');
    style.textContent = `
      body::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--overlay-color);
        mix-blend-mode: normal;
        pointer-events: none;
        z-index: 9999;
        display: var(--overlay-display, none);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <BrowserRouter>
      <ProvidersWrapper>
        <div className="app-container">
          <Toaster />
          <Sonner />
          <AppRoutes />
        </div>
      </ProvidersWrapper>
    </BrowserRouter>
  );
};

export default App;