import React, { useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Play, SkipForward, BookOpen, ListTodo, Brain, TrendingUp } from "lucide-react";

const WELCOME_SHOWN_KEY = "allie_welcome_shown";

export const WelcomeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { startTour, onboardingEnabled, setOnboardingEnabled } = useOnboarding();

  useEffect(() => {
    // Check if welcome has been shown
    const hasSeenWelcome = localStorage.getItem(WELCOME_SHOWN_KEY);
    if (!hasSeenWelcome && onboardingEnabled) {
      // Small delay to let the app render first
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [onboardingEnabled]);

  const handleStartTour = () => {
    localStorage.setItem(WELCOME_SHOWN_KEY, "true");
    setIsOpen(false);
    startTour();
  };

  const handleSkip = () => {
    localStorage.setItem(WELCOME_SHOWN_KEY, "true");
    setIsOpen(false);
  };

  const handleDisableOnboarding = () => {
    localStorage.setItem(WELCOME_SHOWN_KEY, "true");
    setOnboardingEnabled(false);
    setIsOpen(false);
  };

  if (!onboardingEnabled) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Welcome to Allie!
          </DialogTitle>
          <DialogDescription>
            Your ADHD optimised learning and productivity assistant
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Allie is designed to help you stay focused, organised, and motivated. 
            Here's what you can do:
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
              <ListTodo className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Tasks</p>
                <p className="text-xs text-muted-foreground">Stay organised</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
              <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Reading Aids</p>
                <p className="text-xs text-muted-foreground">Focus better</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
              <Brain className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Mind Maps</p>
                <p className="text-xs text-muted-foreground">Visualise ideas</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
              <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Progress</p>
                <p className="text-xs text-muted-foreground">Track growth</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Would you like a quick tour to see how everything works?
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleStartTour} className="w-full gap-2">
            <Play className="h-4 w-4" />
            Take the Tour
          </Button>
          <Button variant="outline" onClick={handleSkip} className="w-full gap-2">
            <SkipForward className="h-4 w-4" />
            Skip for Now
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleDisableOnboarding} 
            className="w-full text-xs text-muted-foreground"
          >
            Don't show tutorials
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
