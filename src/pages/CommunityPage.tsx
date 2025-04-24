
import React, { memo } from "react";
import { Community } from "@/components/Community";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";

const CommunityPage = memo(() => {
  return (
    <div>
      <WorkspaceLayout>
        <Community />
      </WorkspaceLayout>
    </div>
  );
});

CommunityPage.displayName = "CommunityPage";

export default CommunityPage;
