import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const PomodoroTimer = () => {
  const [workMinutes, setWorkMinutes] = React.useState(25);
  const [breakMinutes, setBreakMinutes] = React.useState(5);
  const [seconds, setSeconds] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  const [isWork, setIsWork] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (workMinutes === 0) {
            setIsWork(!isWork);
            setWorkMinutes(isWork ? breakMinutes : workMinutes);
            toast({
              title: isWork ? "Break time!" : "Back to work!",
              description: `Time for a ${isWork ? "break" : "work"} session`,
            });
          } else {
            setWorkMinutes(minutes => minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds => seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, workMinutes, breakMinutes, isWork, toast]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsWork(true);
    setWorkMinutes(25);
    setBreakMinutes(5);
    setSeconds(0);
  };

  return (
    <div className="p-2 space-y-3 animate-fade-in">
      <div className="space-y-1">
        <Label>Work Duration (minutes)</Label>
        <Input
          type="number"
          value={workMinutes}
          onChange={(e) => setWorkMinutes(Number(e.target.value))}
          min="1"
          disabled={isActive}
          className="h-8"
        />
      </div>
      <div className="space-y-1">
        <Label>Break Duration (minutes)</Label>
        <Input
          type="number"
          value={breakMinutes}
          onChange={(e) => setBreakMinutes(Number(e.target.value))}
          min="1"
          disabled={isActive}
          className="h-8"
        />
      </div>
      <div className="text-center py-2">
        <h3 className="text-2xl font-bold text-foreground">
          {String(workMinutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isWork ? "Work Time" : "Break Time"}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={toggleTimer}
          className="flex-1 h-8 text-sm"
        >
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button
          onClick={resetTimer}
          variant="outline"
          className="flex-1 h-8 text-sm"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};