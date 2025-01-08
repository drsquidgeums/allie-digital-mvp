import React from "react";
import { TaskPlanner } from "./TaskPlanner";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { TaskListCard } from "./dashboard/TaskListCard";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Sidebar";
import { TaskAchievements } from "./dashboard/TaskAchievements";

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
  const [showAchievement, setShowAchievement] = React.useState(false);
  const { toast } = useToast();

  const calculateTotalPoints = () => {
    return tasks.reduce((total, task) => total + (task.completed ? task.points : 0), 0);
  };

  const handleAddTask = (text: string) => {
    const taskDate = date || new Date();
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: taskDate,
      points: 10
    };
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = !task.completed;
        if (newStatus) {
          const newTotalPoints = calculateTotalPoints() + task.points;
          if (newTotalPoints >= 20 && newTotalPoints < 50 || 
              newTotalPoints >= 50 && newTotalPoints < 100 ||
              newTotalPoints >= 100) {
            setShowAchievement(true);
          }
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
                  <TaskPlanner 
                    selectedDate={date} 
                    tasks={tasks}
                    onAddTask={handleAddTask}
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
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <TaskAchievements 
        points={calculateTotalPoints()}
        isOpen={showAchievement}
        onClose={() => setShowAchievement(false)}
      />
    </div>
  );
};