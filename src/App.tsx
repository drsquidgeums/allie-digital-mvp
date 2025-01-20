import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import Index from "./pages/Index";
import { TaskDashboard } from "./components/dashboard/TaskDashboard";
import AIAssistant from "./pages/AIAssistant";
import MindMapDashboard from "./pages/MindMapDashboard";
import CommunityPage from "./pages/CommunityPage";
import SettingsPage from "./pages/SettingsPage";
import { PomodoroProvider } from "./contexts/PomodoroContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();

  React.useEffect(() => {
    // Reapply overlay on route changes
    const savedOverlay = localStorage.getItem('irlenOverlayColor');
    if (savedOverlay) {
      document.documentElement.style.setProperty('--overlay-color', savedOverlay);
      document.documentElement.style.setProperty('--overlay-display', 'block');
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/file-uploader" element={<Index />} />
      <Route path="/tasks" element={<TaskDashboard />} />
      <Route path="/ai-assistant" element={<AIAssistant />} />
      <Route path="/mind-map" element={<MindMapDashboard />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/" element={<Navigate to="/file-uploader" replace />} />
    </Routes>
  );
};

const App = () => {
  React.useEffect(() => {
    // Apply saved overlay on app mount and add overlay styles
    const savedOverlay = localStorage.getItem('irlenOverlayColor');
    if (savedOverlay) {
      document.documentElement.style.setProperty('--overlay-color', savedOverlay);
      document.documentElement.style.setProperty('--overlay-display', 'block');
    }

    // Add global overlay styles
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
    <React.StrictMode>
      <NextThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <PomodoroProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </PomodoroProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </NextThemeProvider>
    </React.StrictMode>
  );
};

export default App;