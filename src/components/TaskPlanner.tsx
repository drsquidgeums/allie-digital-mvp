import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// Create a custom event for task updates
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

export const TaskPlanner = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const { toast } = useToast();

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { 
        id: Date.now().toString(), 
        text: newTask, 
        completed: false,
        createdAt: new Date()
      }]);
      setNewTask("");
      emitTaskNotification(
        "New Task Added",
        `Task "${newTask}" has been added to your list`
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
      emitTaskNotification(
        "Task Deleted",
        `Task "${task.text}" has been removed`
      );
    }
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getChartData = () => {
    const today = new Date();
    const lastWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-GB', { weekday: 'short' });
    }).reverse();

    return lastWeek.map(day => ({
      name: day,
      completed: tasks.filter(task => 
        task.completed && 
        task.createdAt.toLocaleDateString('en-GB', { weekday: 'short' }) === day
      ).length,
      total: tasks.filter(task =>
        task.createdAt.toLocaleDateString('en-GB', { weekday: 'short' }) === day
      ).length
    }));
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <form onSubmit={addTask} className="flex gap-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button type="submit">
          Add
        </Button>
      </form>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border"
          >
            <Button
              size="sm"
              variant="ghost"
              className={`p-1 h-6 w-6 ${task.completed ? "bg-green-500 text-white hover:bg-green-600" : ""}`}
              onClick={() => toggleTask(task.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.text}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="p-1 h-6 w-6 text-destructive hover:text-destructive/90"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="h-64 bg-card rounded-lg p-4 border border-border">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" fill="#22c55e" name="Completed" />
            <Bar dataKey="total" fill="#94a3b8" name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};