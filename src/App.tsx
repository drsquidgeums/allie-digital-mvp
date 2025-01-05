import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { TaskDashboard } from "./components/dashboard/TaskDashboard";
import AIAssistant from "./pages/AIAssistant";
import MindMapDashboard from "./pages/MindMapDashboard";
import CommunityPage from "./pages/CommunityPage";
import { PomodoroProvider } from "./contexts/PomodoroContext";
import { AmbientMusic } from "./components/AmbientMusic";

const queryClient = new QueryClient();

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
        pointer-events: none;
        z-index: 9999;
        display: var(--overlay-display, none);
      }
    `;
    document.head.appendChild(style);

    // Set up storage event listener to handle changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'irlenOverlayColor') {
        if (e.newValue) {
          document.documentElement.style.setProperty('--overlay-color', e.newValue);
          document.documentElement.style.setProperty('--overlay-display', 'block');
        } else {
          document.documentElement.style.setProperty('--overlay-display', 'none');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PomodoroProvider>
          <div className="fixed top-4 right-4 z-50">
            <AmbientMusic />
          </div>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tasks" element={<TaskDashboard />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/mind-map" element={<MindMapDashboard />} />
              <Route path="/community" element={<CommunityPage />} />
            </Routes>
          </BrowserRouter>
        </PomodoroProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;