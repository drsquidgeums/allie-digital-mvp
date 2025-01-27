import React from "react";
import { TaskPlanner } from "./TaskPlanner";
import { Calendar } from "@/components/ui/calendar";
import { TaskListCard } from "./dashboard/TaskListCard";
import { Sidebar } from "@/components/Sidebar";
import { TaskAchievements } from "./dashboard/TaskAchievements";
import { useTasks } from "@/hooks/useTasks";
import { Card } from "@/components/ui/card";

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
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Task Planner</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-6">
                <TaskPlanner 
                  selectedDate={date}
                  tasks={tasks}
                  onAddTask={handleAddTaskWithDate}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                />
              </Card>
            </div>
            
            <div className="space-y-8">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Calendar</h2>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>
              </Card>
              
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