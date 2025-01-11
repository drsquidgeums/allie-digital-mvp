import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { DocumentViewer } from "@/components/DocumentViewer";

const Index = () => {
  return (
    <div>
      <WorkspaceLayout>
        <DocumentViewer />
      </WorkspaceLayout>
    </div>
  );
};

export default Index;