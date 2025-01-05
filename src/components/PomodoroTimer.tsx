import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { usePomodoroContext } from "@/contexts/PomodoroContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const PomodoroTimer = () => {
  const { state, dispatch } = usePomodoroContext();
  const progress = ((state.workMinutes * 60 + state.seconds) / (state.isWork ? (25 * 60) : (state.shortBreakMinutes * 60))) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Pomodoro Timer</CardTitle>
          <CardDescription>
            Focus on your tasks with timed work sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Work Duration</Label>
              <Input
                type="number"
                value={state.workMinutes}
                onChange={(e) => dispatch({ 
                  type: 'SET_WORK_MINUTES', 
                  payload: Number(e.target.value) 
                })}
                min="1"
                disabled={state.isActive}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label>Short Break</Label>
              <Input
                type="number"
                value={state.shortBreakMinutes}
                onChange={(e) => dispatch({ 
                  type: 'SET_SHORT_BREAK', 
                  payload: Number(e.target.value) 
                })}
                min="1"
                disabled={state.isActive}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label>Long Break</Label>
              <Input
                type="number"
                value={state.longBreakMinutes}
                onChange={(e) => dispatch({ 
                  type: 'SET_LONG_BREAK', 
                  payload: Number(e.target.value) 
                })}
                min="1"
                disabled={state.isActive}
                className="h-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current Task</Label>
            <Select
              value={state.currentTask || ""}
              onValueChange={(value) => dispatch({ 
                type: 'SET_CURRENT_TASK', 
                payload: value 
              })}
              disabled={state.isActive}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a task" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task1">Task 1</SelectItem>
                <SelectItem value="task2">Task 2</SelectItem>
                <SelectItem value="task3">Task 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-3xl font-bold">
                {String(state.workMinutes).padStart(2, "0")}:
                {String(state.seconds).padStart(2, "0")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {state.isWork ? "Work Time" : "Break Time"}
              </p>
            </div>

            <Progress value={progress} className="h-2" />

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Completed: {state.completedPomodoros} / {state.sessionGoal}
              </div>
              <div className="space-x-2">
                <Button
                  onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}
                  variant="default"
                  size="sm"
                >
                  {state.isActive ? "Pause" : "Start"}
                </Button>
                <Button
                  onClick={() => dispatch({ type: 'RESET_TIMER' })}
                  variant="outline"
                  size="sm"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};