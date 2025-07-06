
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Clock, ListChecks, Target, AlertCircle, CheckCircle2 } from "lucide-react";

interface TaskBreakdownProps {
  task: string;
  onBreakdownGenerated: (breakdown: any) => void;
}

const TaskBreakdown = ({ task, onBreakdownGenerated }: TaskBreakdownProps) => {
  const [breakdown, setBreakdown] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const generateBreakdown = () => {
    // Simulate task breakdown generation
    const steps = [
      { id: 1, title: "Gather materials and resources", duration: "5 min", completed: false },
      { id: 2, title: "Review key concepts", duration: "15 min", completed: false },
      { id: 3, title: "Create study outline", duration: "10 min", completed: false },
      { id: 4, title: "Practice problems", duration: "20 min", completed: false },
      { id: 5, title: "Review and summarize", duration: "10 min", completed: false }
    ];

    const newBreakdown = {
      originalTask: task,
      steps,
      totalDuration: "60 min",
      difficulty: "Moderate"
    };

    setBreakdown(newBreakdown);
    onBreakdownGenerated(newBreakdown);
  };

  const toggleStepComplete = (stepId: number) => {
    if (!breakdown) return;
    
    setBreakdown(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, completed: !step.completed } : step
      )
    }));
  };

  const completedSteps = breakdown?.steps.filter(step => step.completed).length || 0;
  const totalSteps = breakdown?.steps.length || 0;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <ListChecks className="h-5 w-5" />
        <h3 className="font-semibold">Task Breakdown Assistant</h3>
      </div>

      {!breakdown ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground mb-4">
            Break down complex tasks into manageable steps
          </p>
          <Button onClick={generateBreakdown} className="gap-2">
            <Brain className="h-4 w-4" />
            Generate Step-by-Step Guide
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{breakdown.difficulty}</Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {breakdown.totalDuration}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completedSteps}/{totalSteps} steps</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {breakdown.steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    step.completed 
                      ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleStepComplete(step.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {step.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-muted-foreground/30 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-medium ${step.completed ? 'line-through text-muted-foreground' : ''}`}>
                          Step {index + 1}: {step.title}
                        </h4>
                        <Badge variant="secondary" className="ml-2">
                          {step.duration}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Button 
            variant="outline" 
            onClick={() => setBreakdown(null)}
            className="w-full"
          >
            Generate New Breakdown
          </Button>
        </div>
      )}
    </Card>
  );
};

interface FocusTimerProps {
  onTimerComplete: () => void;
}

const FocusTimer = ({ onTimerComplete }: FocusTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onTimerComplete();
      
      // Auto-switch to break mode
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60); // 5 minute break
      } else {
        setMode('focus');
        setTimeLeft(25 * 60); // Back to 25 minute focus
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, onTimerComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  return (
    <Card className="p-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Target className="h-5 w-5" />
        <h3 className="font-semibold">Focus Timer</h3>
      </div>

      <div className="space-y-4">
        <Badge variant={mode === 'focus' ? 'default' : 'secondary'} className="text-sm">
          {mode === 'focus' ? 'Focus Time' : 'Break Time'}
        </Badge>

        <div className="text-4xl font-mono font-bold">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex gap-2 justify-center">
          <Button onClick={toggleTimer} variant={isActive ? 'destructive' : 'default'}>
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant="outline">
            Reset
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {mode === 'focus' 
            ? 'Stay focused on your current task' 
            : 'Take a break and relax'}
        </div>
      </div>
    </Card>
  );
};

export const CognitiveSupportTools = () => {
  const handleBreakdownGenerated = (breakdown: any) => {
    console.log('Task breakdown generated:', breakdown);
  };

  const handleTimerComplete = () => {
    // Could trigger a break reminder or notification
    console.log('Timer completed');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Cognitive Support Tools</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskBreakdown 
          task="Complete Biology Chapter 5 Review"
          onBreakdownGenerated={handleBreakdownGenerated}
        />
        <FocusTimer onTimerComplete={handleTimerComplete} />
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-5 w-5" />
          <h3 className="font-semibold">Study Tips for Focus</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-muted/30 rounded">
            <strong>Minimize Distractions:</strong> Use quiet spaces, turn off notifications
          </div>
          <div className="p-3 bg-muted/30 rounded">
            <strong>Take Regular Breaks:</strong> 5-10 minutes every 25-30 minutes
          </div>
          <div className="p-3 bg-muted/30 rounded">
            <strong>Use Visual Aids:</strong> Charts, diagrams, and color coding
          </div>
          <div className="p-3 bg-muted/30 rounded">
            <strong>Set Clear Goals:</strong> Break large tasks into smaller ones
          </div>
        </div>
      </Card>
    </div>
  );
};
