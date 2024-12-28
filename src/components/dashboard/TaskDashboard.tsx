import React from "react";
import { TaskPlanner } from "../TaskPlanner";
import { Card } from "@/components/ui/card";

export const TaskDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Task Dashboard</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Task Management</h2>
              <TaskPlanner />
            </Card>
            <Card className="p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Task Statistics</h2>
              <div className="h-[400px]">
                {/* The chart is already included in TaskPlanner */}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};