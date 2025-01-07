import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { ChatInput } from "./chat/ChatInput";
import { ChatMessage } from "./chat/ChatMessage";

export const AIAssistant = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    // Handle sending message
    setIsLoading(true);
    // Add your send logic here
    setIsLoading(false);
  };

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
              <h1 className="text-3xl font-bold">AI Assistant</h1>
            </div>
            <Card className="flex-1 p-6">
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <ChatMessage text="Hello! How can I assist you today?" isUser={false} />
                  <ChatMessage text="Feel free to ask me anything." isUser={false} />
                </div>
                <ChatInput 
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSend}
                  isLoading={isLoading}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};