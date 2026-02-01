
import React from 'react';
import { Calendar as CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TaskDashboardHeaderProps {
  selectedDate: Date;
  showCompleted: boolean;
  filterByDate: boolean;
  onToggleCalendar: () => void;
  onToggleShowCompleted: (checked: boolean) => void;
  onToggleFilterByDate: (checked: boolean) => void;
}

export const TaskDashboardHeader: React.FC<TaskDashboardHeaderProps> = ({
  selectedDate,
  showCompleted,
  filterByDate,
  onToggleCalendar,
  onToggleShowCompleted,
  onToggleFilterByDate
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold mb-1">Task Planner</h1>
        <p className="text-muted-foreground">
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleCalendar}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent/30 hover:bg-accent/50 transition-colors"
        >
          <CalendarIcon className="h-4 w-4" />
          <span>Calendar</span>
        </button>
        
        <div className="flex items-center gap-2">
          <Switch 
            id="show-completed" 
            checked={showCompleted} 
            onCheckedChange={onToggleShowCompleted}
          />
          <Label htmlFor="show-completed">Show Completed</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch 
            id="filter-by-date" 
            checked={filterByDate} 
            onCheckedChange={onToggleFilterByDate}
          />
          <Label htmlFor="filter-by-date">Filter by Date</Label>
        </div>
      </div>
    </div>
  );
};
