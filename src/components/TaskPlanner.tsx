import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaskCharts } from "./dashboard/TaskCharts";
import { TaskList } from "./dashboard/TaskList";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  points: number;
}

interface TaskPlannerProps {
  selectedDate?: Date;
}

const emitTaskNotification = (title: string, message: string) => {
  const event = new CustomEvent('taskNotification', {
    detail: { 
      id: Date.now().toString(),
      title,
      message,
      read: false,
      timestamp: new Date()
    }
  });
  window.dispatchEvent(event);
};

export const TaskPlanner = ({ selectedDate }: TaskPlannerProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [points, setPoints] = useState(0);
  const [showStarburst, setShowStarburst] = useState(false);
  const { toast } = useToast();

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      const taskDate = selectedDate || new Date();
      setTasks([...tasks, { 
        id: Date.now().toString(), 
        text: newTask, 
        completed: false,
        createdAt: taskDate,
        points: 10
      }]);
      setNewTask("");
      setShowStarburst(true);
      setTimeout(() => setShowStarburst(false), 700);
      emitTaskNotification(
        "New Task Added",
        `Task "${newTask}" has been added to your list for ${taskDate.toLocaleDateString()}`
      );
      toast({
        title: "Task added",
        description: "New task has been created successfully",
      });
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = !task.completed;
        if (newStatus) {
          setPoints(prev => prev + task.points);
          toast({
            title: "Points earned!",
            description: `You earned ${task.points} points for completing this task!`,
          });
        } else {
          setPoints(prev => prev - task.points);
        }
        emitTaskNotification(
          newStatus ? "Task Completed" : "Task Reopened",
          `Task "${task.text}" has been ${newStatus ? 'completed' : 'reopened'}`
        );
        return { ...task, completed: newStatus };
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      if (task.completed) {
        setPoints(prev => prev - task.points);
      }
      emitTaskNotification(
        "Task Deleted",
        `Task "${task.text}" has been removed`
      );
    }
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-accent/10 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <span className="font-semibold">Total Points:</span>
        </div>
        <span className="text-xl font-bold">{points}</span>
      </div>

      <form onSubmit={addTask} className="flex gap-2 relative">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={`Add a new task${selectedDate ? ` for ${selectedDate.toLocaleDateString()}` : ''}...`}
          className="flex-1"
        />
        <div className="relative">
          <Button type="submit">Add</Button>
          {showStarburst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full animate-[starburst_0.7s_ease-out_forwards]"
                  style={{
                    backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'][i],
                    transform: `rotate(${i * 45}deg) translateY(-20px)`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </form>

      <TaskCharts tasks={tasks} />
      <TaskList 
        tasks={tasks} 
        onToggleTask={toggleTask} 
        onDeleteTask={deleteTask}
      />
    </div>
  );
};