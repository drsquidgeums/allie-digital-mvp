
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import { TaskDashboard } from "@/components/dashboard/TaskDashboard";
import MindMapDashboard from "@/pages/MindMapDashboard";
import CommunityPage from "@/pages/CommunityPage";
import SettingsPage from "@/pages/SettingsPage";
import MyFilesPage from "@/pages/MyFilesPage";
import NdaAdminPage from "@/pages/NdaAdminPage";
import AuthPage from "@/pages/AuthPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const AppRoutes = React.memo(() => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/" element={<Navigate to="/toolbox" replace />} />
    <Route path="/toolbox" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/my-files" element={<ProtectedRoute><MyFilesPage /></ProtectedRoute>} />
    <Route path="/file-uploader" element={<Navigate to="/toolbox" replace />} />
    <Route path="/tasks" element={<ProtectedRoute><TaskDashboard /></ProtectedRoute>} />
    <Route path="/mind-map" element={<ProtectedRoute><MindMapDashboard /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
    <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
    <Route path="/nda-admin" element={<ProtectedRoute><NdaAdminPage /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/toolbox" replace />} />
  </Routes>
));

AppRoutes.displayName = "AppRoutes";
