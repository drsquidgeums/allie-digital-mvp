
import React, { useCallback, useEffect, useMemo, lazy, Suspense } from "react";
import { TaskPlanner } from "../TaskPlanner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Sidebar } from "@/components/Sidebar";
import { TaskAchievements } from "./TaskAchievements";
import { useTasks } from "@/hooks/useTasks";

// Lazy load non-critical component
const TaskListCard = lazy(() => import("./TaskListCard").then(module => ({
  default: module.TaskListCard
})));

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

  // Memoize the calendar section
  const calendarSection = useMemo(() => (
    <Card 
      className="p-4 shadow-md border border-border"
      role="region"
      aria-label="Calendar date picker"
    >
      <h3 
        className="text-lg font-semibold mb-2"
        id="calendar-heading"
      >
        Select Date
      </h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        aria-labelledby="calendar-heading"
      />
    </Card>
  ), [date, setDate]);

  return (
    <div className="flex h-screen bg-background">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar 
        onFileUpload={() => {}} 
        onColorChange={() => {}}
        uploadedFiles={[]}
        onFileSelect={() => {}}
        onFileDelete={() => {}}
      />
      <div className="flex-1 p-6">
        <Card 
          className="h-full bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative shadow-md"
          id="main-content"
          tabIndex={-1}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">Task Dashboard</CardTitle>
          </CardHeader>
          <div className="container mx-auto py-4 px-4">
            <div className="flex flex-col h-[calc(100vh-12rem)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                <Card 
                  className="p-4 shadow-md lg:col-span-2 overflow-auto border border-border"
                  role="region"
                  aria-label="Task planner area"
                >
                  <TaskPlanner 
                    selectedDate={date}
                    tasks={tasks}
                    onAddTask={handleAddTaskWithDate}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </Card>
                <div className="space-y-6">
                  {calendarSection}
                  <Suspense fallback={
                    <div className="flex items-center justify-center p-6 bg-muted/20 rounded-lg min-h-[200px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  }>
                    <TaskListCard
                      tasks={tasks}
                      onToggleTask={handleToggleTask}
                      onDeleteTask={handleDeleteTask}
                      onUpdateTaskColor={handleUpdateTaskColor}
                    />
                  </Suspense>
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
