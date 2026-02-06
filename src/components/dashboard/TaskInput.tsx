
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TaskInputProps {
  selectedDate?: Date;
  onAddTask: (text: string) => void;
  showStarburst: boolean;
}

export const TaskInput = ({ selectedDate, onAddTask, showStarburst }: TaskInputProps) => {
  const [newTask, setNewTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask);
      setNewTask("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 relative" data-tour="task-input">
      <Input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder={`Add a new task${selectedDate ? ` for ${selectedDate.toLocaleDateString()}` : ''}...`}
        className="flex-1 text-foreground placeholder:text-muted-foreground dark:text-gray-200 dark:placeholder:text-gray-400"
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
  );
};
