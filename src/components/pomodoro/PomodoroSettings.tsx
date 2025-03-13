
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import { usePomodoroContext } from "@/contexts/PomodoroContext";

export const PomodoroSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = usePomodoroContext();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex w-full justify-between p-3"
        >
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="text-sm">Timer Settings</span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workMinutes" className="text-xs">
                Work Minutes
              </Label>
              <Input
                id="workMinutes"
                type="number"
                min="1"
                max="60"
                value={state.workMinutes}
                onChange={(e) =>
                  dispatch({
                    type: "SET_WORK_MINUTES",
                    payload: parseInt(e.target.value) || 25,
                  })
                }
                disabled={state.isActive}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortBreak" className="text-xs">
                Short Break (mins)
              </Label>
              <Input
                id="shortBreak"
                type="number"
                min="1"
                max="30"
                value={state.shortBreakMinutes}
                onChange={(e) =>
                  dispatch({
                    type: "SET_SHORT_BREAK",
                    payload: parseInt(e.target.value) || 5,
                  })
                }
                disabled={state.isActive}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longBreak" className="text-xs">
                Long Break (mins)
              </Label>
              <Input
                id="longBreak"
                type="number"
                min="5"
                max="60"
                value={state.longBreakMinutes}
                onChange={(e) =>
                  dispatch({
                    type: "SET_LONG_BREAK",
                    payload: parseInt(e.target.value) || 15,
                  })
                }
                disabled={state.isActive}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionGoal" className="text-xs">
                Session Goal
              </Label>
              <Input
                id="sessionGoal"
                type="number"
                min="1"
                max="20"
                value={state.sessionGoal}
                onChange={(e) =>
                  dispatch({
                    type: "SET_SESSION_GOAL",
                    payload: parseInt(e.target.value) || 4,
                  })
                }
                disabled={state.isActive}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pomodorosRequired" className="text-xs">
              Pomodoros to Complete Task
            </Label>
            <Input
              id="pomodorosRequired"
              type="number"
              min="1"
              max="10"
              value={state.pomodorosRequired}
              onChange={(e) =>
                dispatch({
                  type: "SET_POMODOROS_REQUIRED",
                  payload: parseInt(e.target.value) || 4,
                })
              }
              disabled={state.isActive}
            />
            <p className="text-xs text-muted-foreground">
              Number of pomodoros required to mark a task as complete
            </p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}