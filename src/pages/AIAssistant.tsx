
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { AIAssistant as AIAssistantComponent } from "@/components/AIAssistant";
import { Sidebar } from "@/components/Sidebar";
import DocumentViewer from "@/components/DocumentViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <Tabs defaultValue="assistant" className="h-full">
          <TabsList className="mb-4">
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="split">Split View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assistant" className="h-[calc(100vh-8rem)]">
            <Card className="h-full shadow-lg">
              <AIAssistantComponent 
                documentContent={documentContent} 
                documentName={documentName} 
              />
            </Card>
          </TabsContent>
          
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
          
          <TabsContent value="split" className="h-[calc(100vh-8rem)] flex flex-col sm:flex-row gap-4">
            <Card className="h-full shadow-lg flex-1">
              <DocumentViewer 
                file={null}
                selectedColor={selectedColor}
                isHighlighter={true}
                onContentLoaded={handleContentLoaded}
              />
            </Card>
            <Card className="h-full shadow-lg flex-1">
              <AIAssistantComponent 
                documentContent={documentContent} 
                documentName={documentName} 
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAssistant;
