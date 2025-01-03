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
      :root::after {
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

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tasks" element={<TaskDashboard />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/mind-map" element={<MindMapDashboard />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;