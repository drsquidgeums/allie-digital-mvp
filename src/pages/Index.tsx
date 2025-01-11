import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { DocumentViewer } from "@/components/DocumentViewer";
import { useState } from "react";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#000000");

  return (
    <div>
      <WorkspaceLayout>
        <DocumentViewer 
          file={selectedFile}
          selectedColor={selectedColor}
        />
      </WorkspaceLayout>
    </div>
  );
};

export default Index;