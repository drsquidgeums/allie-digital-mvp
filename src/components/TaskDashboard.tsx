import React from "react";
import { TaskPlanner } from "../TaskPlanner";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { TaskListCard } from "./TaskListCard";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Sidebar";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
}

export const TaskDashboard = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const { toast } = useToast();

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = !task.completed;
        if (newStatus) {
          toast({
            title: "Points earned!",
            description: `You earned ${task.points} points for completing this task!`,
          });
        }
        return { ...task, completed: newStatus };
      }
      return task;
    }));
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setTasks(tasks.filter(task => task.id !== id));
    }
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
      <div className="flex-1 p-6">
        <Card className="h-full bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative">
          <div className="container mx-auto py-4 px-4">
            <div className="flex flex-col h-[calc(100vh-8rem)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                <Card className="p-4 shadow-lg lg:col-span-2 overflow-auto">
                  <TaskPlanner selectedDate={date} />
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
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};