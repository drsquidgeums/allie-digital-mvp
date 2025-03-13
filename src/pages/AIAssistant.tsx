
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import DocumentViewer from "@/components/DocumentViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/Sidebar";

const AIAssistant = () => {
  const [documentContent, setDocumentContent] = useState<string>("");
  const [documentName, setDocumentName] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("#FFFF00");

  const handleContentLoaded = (content: string, fileName: string) => {
    setDocumentContent(content);
    setDocumentName(fileName);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onFileUpload={() => {}} 
        onColorChange={handleColorChange}
        uploadedFiles={[]}
        onFileSelect={() => {}}
        onFileDelete={() => {}}
      />
      <div className="flex-1 p-6">
        <Tabs defaultValue="document" className="h-full">
          <TabsList className="mb-4">
            <TabsTrigger value="document">Document</TabsTrigger>
          </TabsList>
          
          <TabsContent value="document" className="h-[calc(100vh-8rem)]">
            <Card className="h-full shadow-lg">
              <DocumentViewer 
                file={null}
                selectedColor={selectedColor}
                isHighlighter={true}
                onContentLoaded={handleContentLoaded}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAssistant;
