
import React from "react";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { NdaAdminView } from "@/components/nda/NdaAdminView";

const NdaAdminPage = () => {
  return (
    <WorkspaceLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">NDA Administration</h1>
        <NdaAdminView isAdmin={false} />
      </div>
    </WorkspaceLayout>
  );
};

export default NdaAdminPage;
