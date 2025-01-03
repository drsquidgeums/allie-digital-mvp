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
    // Apply saved overlay on app mount
    const savedOverlay = localStorage.getItem('irlenOverlayColor');
    if (savedOverlay) {
      document.documentElement.style.setProperty('--overlay-color', savedOverlay);
      document.documentElement.style.setProperty('--overlay-display', 'block');
    }
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