
import React, { useCallback, useEffect } from "react";
import { TaskPlanner } from "../TaskPlanner";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { TaskListCard } from "./TaskListCard";
import { Sidebar } from "@/components/Sidebar";
import { TaskAchievements } from "./TaskAchievements";
import { useTasks } from "@/hooks/useTasks";

export const TaskDashboard = React.memo(() => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const {
    tasks,
    showAchievement,
    setShowAchievement,
    calculateTotalPoints,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleUpdateTaskColor
  } = useTasks();

  const handleAddTaskWithDate = useCallback((text: string) => {
    const taskDate = date || new Date();
    handleAddTask(text, taskDate);
  }, [date, handleAddTask]);

  // Separate points calculation from render
  const [points, setPoints] = React.useState(0);
  useEffect(() => {
    setPoints(calculateTotalPoints());
  }, [tasks, calculateTotalPoints]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onFileUpload={() => {}} 
        onColorChange={() => {}}
        uploadedFiles={[]}
        onFileSelect={() => {}}
        onFileDelete={() => {}}
      />
      <div className="flex-1 p-6">
        <Card className="h-full bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative">
          <div className="container mx-auto py-4 px-4">
            <div className="flex flex-col h-[calc(100vh-8rem)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                <Card className="p-4 shadow-lg lg:col-span-2 overflow-auto">
                  <TaskPlanner 
                    selectedDate={date}
                    tasks={tasks}
                    onAddTask={handleAddTaskWithDate}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </Card>
                <div className="space-y-4">
                  <Card className="p-4 shadow-lg">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </Card>
                  <TaskListCard
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTaskColor={handleUpdateTaskColor}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <TaskAchievements 
        points={points}
        isOpen={showAchievement}
        onClose={() => setShowAchievement(false)}
      />
    </div>
  );
});

TaskDashboard.displayName = "TaskDashboard";
