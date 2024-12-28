import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MindMap } from "@/components/MindMap";

const MindMapDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Mind Map Dashboard</h1>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/')}
              className="w-10 h-10"
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
          <Card className="p-6 shadow-lg">
            <MindMap />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MindMapDashboard;