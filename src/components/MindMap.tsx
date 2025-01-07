import React from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { MindMapContainer } from "./mindmap/MindMapContainer";

export const MindMap = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onFileUpload={() => {}} 
        onColorChange={() => {}}
        uploadedFiles={[]}
        onFileSelect={() => {}}
        onFileDelete={() => {}}
      />
      <div className="flex-1 min-h-screen bg-background">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Mind Map</h1>
            </div>
            <Card className="flex-1 p-6">
              <MindMapContainer />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};