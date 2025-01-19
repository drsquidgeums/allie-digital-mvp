import React from "react";
import { Settings } from "@/components/Settings";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";

const SettingsPage = () => {
  return (
    <WorkspaceLayout>
      <Settings />
    </WorkspaceLayout>
  );
};

export default SettingsPage;