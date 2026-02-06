import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface OnboardingStep {
  id: string;
  target: string; // CSS selector
  title: string;
  description: string;
  placement?: "top" | "bottom" | "left" | "right";
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  route?: string;
}

interface OnboardingContextType {
  // Tour
  isTourActive: boolean;
  currentTourStep: number;
  tourSteps: OnboardingStep[];
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  
  // Hints
  hintsEnabled: boolean;
  setHintsEnabled: (enabled: boolean) => void;
  dismissedHints: string[];
  dismissHint: (hintId: string) => void;
  
  // Checklist
  checklistItems: ChecklistItem[];
  completeChecklistItem: (itemId: string) => void;
  resetChecklist: () => void;
  
  // Settings
  onboardingEnabled: boolean;
  setOnboardingEnabled: (enabled: boolean) => void;
  hasCompletedOnboarding: boolean;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const STORAGE_KEY = "allie_onboarding";

const defaultTourSteps: OnboardingStep[] = [
  {
    id: "sidebar",
    target: "[data-tour='sidebar']",
    title: "Navigation Sidebar",
    description: "This is your main navigation. Access all your tools from here - Tasks, Files, Mind Maps, and more!",
    placement: "right"
  },
  {
    id: "tasks",
    target: "[data-tour='task-input']",
    title: "Quick Task Entry",
    description: "Add tasks instantly! Just type and press Enter. Allie helps you stay organised with ADHD-friendly task management.",
    placement: "bottom"
  },
  {
    id: "study-buddy",
    target: "[data-tour='study-buddy']",
    title: "AI Study Buddy",
    description: "Your personal AI assistant! Get help with studying, break down complex topics, or just chat for motivation.",
    placement: "left"
  },
  {
    id: "toolbox",
    target: "[data-tour='toolbox']",
    title: "Toolbox",
    description: "Access powerful reading aids like Bionic Reader, Beeline Reader, and text-to-speech to help you focus.",
    placement: "right"
  },
  {
    id: "progress",
    target: "[data-tour='progress']",
    title: "Progress Dashboard",
    description: "Track your productivity with streaks, charts, and AI insights. Celebrate your wins!",
    placement: "right"
  }
];

const defaultChecklistItems: ChecklistItem[] = [
  {
    id: "create-task",
    title: "Create your first task",
    description: "Add a task using the task input",
    completed: false,
    route: "/toolbox"
  },
  {
    id: "complete-task",
    title: "Complete a task",
    description: "Mark a task as done",
    completed: false,
    route: "/toolbox"
  },
  {
    id: "upload-file",
    title: "Upload a document",
    description: "Upload a PDF or text file to read",
    completed: false,
    route: "/my-files"
  },
  {
    id: "use-study-buddy",
    title: "Chat with Study Buddy",
    description: "Ask Allie for help with anything",
    completed: false
  },
  {
    id: "try-mind-map",
    title: "Create a mind map",
    description: "Visualise your ideas",
    completed: false,
    route: "/mind-map"
  },
  {
    id: "check-progress",
    title: "View your progress",
    description: "See your productivity stats",
    completed: false,
    route: "/progress"
  }
];

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [dismissedHints, setDismissedHints] = useState<string[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(defaultChecklistItems);
  const [onboardingEnabled, setOnboardingEnabled] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setDismissedHints(data.dismissedHints || []);
        setChecklistItems(prev => prev.map(item => ({
          ...item,
          completed: data.completedItems?.includes(item.id) || false
        })));
        setOnboardingEnabled(data.onboardingEnabled ?? true);
        setHintsEnabled(data.hintsEnabled ?? true);
        setHasCompletedOnboarding(data.hasCompletedOnboarding ?? false);
      }
    } catch (e) {
      console.error("Error loading onboarding state:", e);
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    try {
      const data = {
        dismissedHints,
        completedItems: checklistItems.filter(i => i.completed).map(i => i.id),
        onboardingEnabled,
        hintsEnabled,
        hasCompletedOnboarding
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving onboarding state:", e);
    }
  }, [dismissedHints, checklistItems, onboardingEnabled, hintsEnabled, hasCompletedOnboarding]);

  const startTour = useCallback(() => {
    setCurrentTourStep(0);
    setIsTourActive(true);
  }, []);

  const endTour = useCallback(() => {
    setIsTourActive(false);
    setHasCompletedOnboarding(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentTourStep < defaultTourSteps.length - 1) {
      setCurrentTourStep(prev => prev + 1);
    } else {
      endTour();
    }
  }, [currentTourStep, endTour]);

  const prevStep = useCallback(() => {
    if (currentTourStep > 0) {
      setCurrentTourStep(prev => prev - 1);
    }
  }, [currentTourStep]);

  const skipTour = useCallback(() => {
    setIsTourActive(false);
    setHasCompletedOnboarding(true);
  }, []);

  const dismissHint = useCallback((hintId: string) => {
    setDismissedHints(prev => [...prev, hintId]);
  }, []);

  const completeChecklistItem = useCallback((itemId: string) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, completed: true } : item
    ));
  }, []);

  const resetChecklist = useCallback(() => {
    setChecklistItems(defaultChecklistItems);
  }, []);

  const resetOnboarding = useCallback(() => {
    setDismissedHints([]);
    setChecklistItems(defaultChecklistItems);
    setHasCompletedOnboarding(false);
    setCurrentTourStep(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <OnboardingContext.Provider value={{
      isTourActive,
      currentTourStep,
      tourSteps: defaultTourSteps,
      startTour,
      endTour,
      nextStep,
      prevStep,
      skipTour,
      hintsEnabled,
      setHintsEnabled,
      dismissedHints,
      dismissHint,
      checklistItems,
      completeChecklistItem,
      resetChecklist,
      onboardingEnabled,
      setOnboardingEnabled,
      hasCompletedOnboarding,
      resetOnboarding
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
};
