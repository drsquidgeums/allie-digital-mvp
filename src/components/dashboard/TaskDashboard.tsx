import React from "react";
import { TaskPlanner } from "../TaskPlanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { TaskListCard } from "./TaskListCard";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
}

export const TaskDashboard = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Task Dashboard</h1>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/')}
              className="w-10 h-10"
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 shadow-lg lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Task Management</h2>
              <TaskPlanner selectedDate={date} />
            </Card>
            <div className="space-y-6">
              <Card className="p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Calendar</h2>
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
              <Card className="p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Achievements</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Task Master</span>
                    <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-3/4" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Streak Champion</span>
                    <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-1/2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Early Bird</span>
                    <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-1/4" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};