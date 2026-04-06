
import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const GOAL_KEY = 'daily_focus_goal';
const GOAL_DATE_KEY = 'daily_focus_goal_date';

interface DailyGoal {
  type: 'tasks' | 'time';
  target: number;
}

interface DailyFocusGoalProps {
  completedTasks: number;
}

export const DailyFocusGoal: React.FC<DailyFocusGoalProps> = ({ completedTasks }) => {
  const [goal, setGoal] = useState<DailyGoal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('5');

  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem(GOAL_DATE_KEY);
    const savedGoal = localStorage.getItem(GOAL_KEY);

    if (savedDate === today && savedGoal) {
      try {
        setGoal(JSON.parse(savedGoal));
      } catch {}
    } else {
      // Reset for new day
      localStorage.removeItem(GOAL_KEY);
      localStorage.removeItem(GOAL_DATE_KEY);
    }
  }, []);

  const saveGoal = () => {
    const num = parseInt(inputValue);
    if (isNaN(num) || num <= 0) return;
    const newGoal: DailyGoal = { type: 'tasks', target: num };
    setGoal(newGoal);
    setIsEditing(false);
    localStorage.setItem(GOAL_KEY, JSON.stringify(newGoal));
    localStorage.setItem(GOAL_DATE_KEY, new Date().toDateString());
  };

  const progress = goal ? Math.min(100, Math.round((completedTasks / goal.target) * 100)) : 0;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (!goal && !isEditing) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border bg-card">
        <Target className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Set a daily goal to stay motivated</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          Set Goal
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
        <Target className="h-5 w-5 text-primary" />
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm">Complete</span>
          <Input
            type="number"
            min={1}
            max={50}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-16 h-7 text-sm"
          />
          <span className="text-sm">tasks today</span>
        </div>
        <Button size="sm" onClick={saveGoal}>Save</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" className="stroke-muted" strokeWidth="4" />
          <circle
            cx="32" cy="32" r={radius} fill="none"
            className="stroke-primary"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-foreground">{progress}%</span>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">
          {completedTasks} / {goal!.target} tasks
        </p>
        <p className="text-xs text-muted-foreground">
          {progress >= 100 ? '🎉 Goal reached! Well done!' : 'Keep going, you\'re doing great!'}
        </p>
      </div>
      <Button variant="ghost" size="sm" className="text-xs" onClick={() => setIsEditing(true)}>
        Edit
      </Button>
    </div>
  );
};
