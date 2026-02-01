
import React, { useState, useMemo } from 'react';
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { useTasks } from "@/hooks/useTasks";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { TaskInput } from "@/components/dashboard/TaskInput";
import { TaskColumn } from "@/components/dashboard/TaskColumn";
import { TaskDashboardHeader } from "@/components/dashboard/TaskDashboardHeader";
import { TaskAISuggestions } from "@/components/tasks/TaskAISuggestions";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const TaskDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [filterByDate, setFilterByDate] = useState<boolean>(false);
  const [showAISuggestions, setShowAISuggestions] = useState<boolean>(false);
  
  const { 
    tasks, 
    loading,
    handleAddTask, 
    handleToggleTask, 
    handleDeleteTask,
    handleUpdateTaskColor,
    handleUpdateTaskLabels
  } = useTasks();

  const groupedTasks = useMemo(() => {
    const filteredTasks = filterByDate ? tasks.filter(task => {
      if (!selectedDate) return true;
      
      const taskDate = new Date(task.createdAt);
      return (
        taskDate.getDate() === selectedDate.getDate() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getFullYear() === selectedDate.getFullYear()
      );
    }) : tasks;

    return {
      todo: filteredTasks.filter(task => !task.completed),
      completed: filteredTasks.filter(task => task.completed),
    };
  }, [tasks, selectedDate, filterByDate]);

  return (
    <WorkspaceLayout>
      <div className="p-6 h-full overflow-auto">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <TaskDashboardHeader 
              selectedDate={selectedDate}
              showCompleted={showCompleted}
              filterByDate={filterByDate}
              onToggleCalendar={() => setShowCalendar(!showCalendar)}
              onToggleShowCompleted={setShowCompleted}
              onToggleFilterByDate={setFilterByDate}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              AI Assist
            </Button>
          </div>

        {showCalendar && (
          <Card className="p-4 mb-6 border-none shadow-sm">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border-none mx-auto"
            />
          </Card>
        )}

        {showAISuggestions && (
          <div className="mb-6">
            <TaskAISuggestions
              onAddTask={(text) => handleAddTask(text, selectedDate)}
              currentTasks={tasks.map(t => t.text)}
            />
          </div>
        )}

        <div className="mb-6">
          <TaskInput 
            selectedDate={selectedDate}
            onAddTask={(text) => handleAddTask(text, selectedDate)}
            showStarburst={false}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TaskColumn 
            title="To Do" 
            tasks={groupedTasks.todo}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTaskColor={handleUpdateTaskColor}
            onUpdateTaskLabels={handleUpdateTaskLabels}
            isLoading={loading}
            emptyMessage="No tasks to do! Add some using the form above."
            className="bg-background border border-dashed border-accent/50 rounded-lg"
          />

          {showCompleted && (
            <TaskColumn
              title="Completed" 
              tasks={groupedTasks.completed}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTaskColor={handleUpdateTaskColor}
              onUpdateTaskLabels={handleUpdateTaskLabels}
              isLoading={loading}
              emptyMessage="No completed tasks yet. Complete a task to see it here!"
              className="bg-background/50 border border-dashed border-muted/50 rounded-lg"
            />
          )}
        </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};
