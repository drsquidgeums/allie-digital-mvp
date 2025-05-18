
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import { TaskDashboard } from "@/components/dashboard/TaskDashboard";
import AIAssistant from "@/pages/AIAssistant";
import MindMapDashboard from "@/pages/MindMapDashboard";
import CommunityPage from "@/pages/CommunityPage";
import SettingsPage from "@/pages/SettingsPage";
import MyFilesPage from "@/pages/MyFilesPage";
import NdaAdminPage from "@/pages/NdaAdminPage";

export const AppRoutes = React.memo(() => (
  <Routes>
    <Route path="/" element={<Navigate to="/toolbox" replace />} />
    <Route path="/toolbox" element={<Index />} />
    <Route path="/my-files" element={<MyFilesPage />} />
    <Route path="/file-uploader" element={<Navigate to="/toolbox" replace />} />
    <Route path="/tasks" element={<TaskDashboard />} />
    <Route path="/ai-assistant" element={<AIAssistant />} />
    
    {/* Disabled routes - redirect to toolbox */}
    <Route path="/mind-map" element={<Navigate to="/toolbox" replace />} />
    <Route path="/settings" element={<Navigate to="/toolbox" replace />} />
    <Route path="/community" element={<Navigate to="/toolbox" replace />} />
    
    <Route path="/nda-admin" element={<NdaAdminPage />} />
    {/* Add a catch-all route to redirect to toolbox */}
    <Route path="*" element={<Navigate to="/toolbox" replace />} />
  </Routes>
));

AppRoutes.displayName = "AppRoutes";
