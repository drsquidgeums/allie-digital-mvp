import React from "react";
import { TaskPlanner } from "../TaskPlanner";
import { Card } from "@/components/ui/card";

export const TaskDashboard = () => {
  return (
    <div className="h-full p-6 bg-background">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Task Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Task Management</h2>
            <TaskPlanner />
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Task Statistics</h2>
            <div className="h-[300px]">
              {/* The chart is already included in TaskPlanner */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};