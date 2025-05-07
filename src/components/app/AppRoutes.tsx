
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import { TaskDashboard } from "@/components/dashboard/TaskDashboard";
import AIAssistant from "@/pages/AIAssistant";
import MindMapDashboard from "@/pages/MindMapDashboard";
import CommunityPage from "@/pages/CommunityPage";
import SettingsPage from "@/pages/SettingsPage";
import MyFilesPage from "@/pages/MyFilesPage";
import AuthPage from "@/pages/AuthPage";
import { RequireAuth, RedirectIfAuthenticated } from "@/components/auth/AuthProvider";

export const AppRoutes = React.memo(() => (
  <Routes>
    <Route path="/" element={<Navigate to="/toolbox" replace />} />
    <Route path="/auth" element={
      <RedirectIfAuthenticated>
        <AuthPage />
      </RedirectIfAuthenticated>
    } />
    
    <Route path="/toolbox" element={
      <RequireAuth>
        <Index />
      </RequireAuth>
    } />
    
    <Route path="/my-files" element={
      <RequireAuth>
        <MyFilesPage />
      </RequireAuth>
    } />
    
    <Route path="/file-uploader" element={<Navigate to="/toolbox" replace />} />
    
    <Route path="/tasks" element={
      <RequireAuth>
        <TaskDashboard />
      </RequireAuth>
    } />
    
    <Route path="/ai-assistant" element={
      <RequireAuth>
        <AIAssistant />
      </RequireAuth>
    } />
    
    <Route path="/mind-map" element={
      <RequireAuth>
        <MindMapDashboard />
      </RequireAuth>
    } />
    
    <Route path="/settings" element={
      <RequireAuth>
        <SettingsPage />
      </RequireAuth>
    } />
    
    <Route path="/community" element={
      <RequireAuth>
        <CommunityPage />
      </RequireAuth>
    } />
    
    {/* Add a catch-all route to redirect to toolbox */}
    <Route path="*" element={<Navigate to="/toolbox" replace />} />
  </Routes>
));

AppRoutes.displayName = "AppRoutes";
