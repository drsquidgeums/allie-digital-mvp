import React from "react";
import { TaskPlanner } from "./TaskPlanner";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { TaskListCard } from "./dashboard/TaskListCard";
import { Sidebar } from "@/components/Sidebar";
import { TaskAchievements } from "./dashboard/TaskAchievements";
import { useTasks } from "@/hooks/useTasks";

export const TaskDashboard = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const {
    tasks,
    showAchievement,
    setShowAchievement,
    calculateTotalPoints,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask
  } = useTasks();

  const handleAddTaskWithDate = (text: string) => {
    const taskDate = date || new Date();
    handleAddTask(text, taskDate);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        onFileUpload={() => {}} 
        onColorChange={() => {}}
        uploadedFiles={[]}
        onFileSelect={() => {}}
        onFileDelete={() => {}}
      />
      <main className="flex-1 p-6">
        <div className="container mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TaskPlanner 
                selectedDate={date}
                tasks={tasks}
                onAddTask={handleAddTaskWithDate}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <TaskListCard
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          </div>
        </div>
      </main>
      <TaskAchievements 
        points={calculateTotalPoints()}
        isOpen={showAchievement}
        onClose={() => setShowAchievement(false)}
      />
    </div>
  );
};