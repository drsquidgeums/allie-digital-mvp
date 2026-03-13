import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface OnboardingStep {
  id: string;
  target: string; // CSS selector
  title: string;
  description: string;
  placement?: "top" | "bottom" | "left" | "right";
  route?: string; // Route to navigate to before showing this step
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
  
  // Settings
  onboardingEnabled: boolean;
  setOnboardingEnabled: (enabled: boolean) => void;
  hasCompletedOnboarding: boolean;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const STORAGE_KEY = "allie_onboarding";

// Comprehensive tour covering all sidebar navigation and workspace tools
const defaultTourSteps: OnboardingStep[] = [
  // === SIDEBAR NAVIGATION ===
  {
    id: "workspace",
    target: "[data-tour='workspace']",
    title: "Workspace",
    description: "Your main reading and study area. Upload documents and use powerful accessibility tools to help you focus and understand content better.",
    placement: "right"
  },
  {
    id: "myfiles",
    target: "[data-tour='myfiles']",
    title: "My Files",
    description: "Access all your uploaded documents in one place. Organise files into folders and quickly open them in the workspace.",
    placement: "right"
  },
  {
    id: "tasks",
    target: "[data-tour='tasks']",
    title: "Task Entry",
    description: "Create and manage your to do list. Break down work into manageable chunks with our ADHD friendly task system.",
    placement: "right"
  },
  {
    id: "mindmap",
    target: "[data-tour='mindmap']",
    title: "Mind Map",
    description: "Visualise your ideas and create connections between concepts. Great for brainstorming and revision.",
    placement: "right"
  },
  {
    id: "progress",
    target: "[data-tour='progress']",
    title: "Progress",
    description: "Track your productivity with streaks, charts, and AI insights. Celebrate your wins and stay motivated!",
    placement: "right"
  },
  {
    id: "settings",
    target: "[data-tour='settings']",
    title: "Settings",
    description: "Customise Allie to work for you. Change language, accessibility options, and manage your account.",
    placement: "right"
  },
  {
    id: "logout",
    target: "[data-tour='logout']",
    title: "Sign Out",
    description: "Securely sign out of your account when you're done.",
    placement: "right"
  },
  {
    id: "ai-credits",
    target: "[data-tour='ai-credits']",
    title: "AI Credits",
    description: "You get 15 free AI uses per month with our built-in AI features like Simplify, Document AI, and Learning Tools. This badge shows your remaining credits.",
    placement: "right"
  },
  {
    id: "discord",
    target: "[data-tour='discord']",
    title: "Discord Community",
    description: "Join our Discord community to connect with other users, get tips, share feedback, and stay updated on new features.",
    placement: "right"
  },
  {
    id: "support",
    target: "[data-tour='support']",
    title: "Support",
    description: "Need help? Send us a message and we'll get back to you. You can also submit feedback and feature requests here.",
    placement: "right"
  },
  {
    id: "theme",
    target: "[data-tour='theme']",
    title: "Theme Toggle",
    description: "Switch between light and dark mode. Dark mode can help reduce eye strain during long study sessions.",
    placement: "right"
  },
  // === WORKSPACE TOOLS (need to be on /toolbox route) ===
  {
    id: "screenshot",
    target: "[data-tour='screenshot']",
    title: "Screenshot",
    description: "Capture screenshots of your document or selected areas. Annotate and save images for your notes.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "focus-mode",
    target: "[data-tour='focus-mode']",
    title: "Focus Mode",
    description: "Hide distractions and focus on your reading. Creates a clean, minimal interface for deep concentration.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "bionic",
    target: "[data-tour='bionic']",
    title: "Bionic Reading",
    description: "Highlights the first part of each word to help your eyes glide through text faster. Great for improving reading speed and focus.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "beeline",
    target: "[data-tour='beeline']",
    title: "Beeline Reader",
    description: "Adds a colour gradient to lines of text to help your eyes track from line to line more easily.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "tts",
    target: "[data-tour='tts']",
    title: "Text to Speech",
    description: "Have documents read aloud to you. Helpful for auditory learners or when you need a break from reading.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "stt",
    target: "[data-tour='stt']",
    title: "Speech to Text",
    description: "Dictate notes and text using your voice. Perfect for capturing ideas quickly without typing.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "pomodoro",
    target: "[data-tour='pomodoro']",
    title: "Pomodoro Timer",
    description: "Work in focused 25 minute sessions with short breaks. A proven technique to maintain concentration.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "irlen",
    target: "[data-tour='irlen']",
    title: "Irlen Overlay",
    description: "Apply tinted overlays to reduce visual stress. Some people find certain colours make reading easier.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "text-options",
    target: "[data-tour='text-options']",
    title: "Text Options",
    description: "Change font style and size to make reading more comfortable. Choose from dyslexia friendly fonts and adjust text to suit your needs.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "ai-credits",
    target: "[data-tour='ai-credits']",
    title: "AI Credits",
    description: "You get 15 free AI uses per month with our built-in AI features like Simplify, Document AI, and Learning Tools. This badge shows your remaining credits.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "external-apis",
    target: "[data-tour='ai-credits']",
    title: "External API Accounts",
    description: "Some features require separate accounts: ElevenLabs (for Voice AI) and Anthropic/Claude (for advanced AI). You can set these up in Settings by adding your own API keys. OpenAI keys can also be added for unlimited built-in AI access.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "ai-simplify",
    target: "[data-tour='ai-simplify']",
    title: "AI Simplify",
    description: "Reword complex text into simpler language. Helps break down academic or technical content.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "document-ai",
    target: "[data-tour='document-ai']",
    title: "Document AI",
    description: "Ask questions about your document and get instant answers. Great for understanding difficult passages.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "voice-ai",
    target: "[data-tour='voice-ai']",
    title: "Voice AI",
    description: "Have a voice conversation with AI about your studies. Speak naturally and get spoken responses.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "learning-ai",
    target: "[data-tour='learning-ai']",
    title: "Learning Tools",
    description: "Generate flashcards, quizzes, and summaries from your documents. Turn passive reading into active learning.",
    placement: "bottom",
    route: "/toolbox"
  },
  {
    id: "ambient",
    target: "[data-tour='ambient']",
    title: "Ambient Music",
    description: "Play calming background sounds to help you focus. Choose from rain, café ambience, and more.",
    placement: "bottom",
    route: "/toolbox"
  },
  // === AI STUDY BUDDY ===
  {
    id: "study-buddy",
    target: "[data-tour='study-buddy']",
    title: "AI Study Buddy",
    description: "Your personal AI assistant! Click this anytime to get help with studying, break down complex topics, or just chat for motivation.",
    placement: "left",
    route: "/toolbox"
  }
];

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [onboardingEnabled, setOnboardingEnabled] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setOnboardingEnabled(data.onboardingEnabled ?? true);
        setHasCompletedOnboarding(data.hasCompletedOnboarding ?? false);
      }
      
      // Auto-start tour for new users who haven't seen the welcome modal
      const hasSeenWelcome = localStorage.getItem("allie_welcome_shown");
      if (!hasSeenWelcome) {
        // Welcome modal will handle showing the tour option
        // This is just for users who might have closed the modal without choosing
      }
    } catch (e) {
      console.error("Error loading onboarding state:", e);
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    try {
      const data = {
        onboardingEnabled,
        hasCompletedOnboarding
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving onboarding state:", e);
    }
  }, [onboardingEnabled, hasCompletedOnboarding]);

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

  const resetOnboarding = useCallback(() => {
    setHasCompletedOnboarding(false);
    setCurrentTourStep(0);
    localStorage.removeItem(STORAGE_KEY);
    // Also clear the welcome shown flag
    localStorage.removeItem("allie_welcome_shown");
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
