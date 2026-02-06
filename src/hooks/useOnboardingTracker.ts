import { useEffect, useRef } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useLocation } from "react-router-dom";

/**
 * Hook that tracks user actions and completes onboarding checklist items
 * automatically when users perform certain actions.
 */
export const useOnboardingTracker = () => {
  const { completeChecklistItem, onboardingEnabled } = useOnboarding();
  const location = useLocation();
  const hasTrackedRef = useRef<Set<string>>(new Set());

  // Track page visits for progress dashboard
  useEffect(() => {
    if (!onboardingEnabled) return;
    
    if (location.pathname === "/progress" && !hasTrackedRef.current.has("check-progress")) {
      hasTrackedRef.current.add("check-progress");
      completeChecklistItem("check-progress");
    }
    
    if (location.pathname === "/mind-map" && !hasTrackedRef.current.has("try-mind-map")) {
      hasTrackedRef.current.add("try-mind-map");
      completeChecklistItem("try-mind-map");
    }
  }, [location.pathname, completeChecklistItem, onboardingEnabled]);

  return {
    trackTaskCreated: () => {
      if (!hasTrackedRef.current.has("create-task")) {
        hasTrackedRef.current.add("create-task");
        completeChecklistItem("create-task");
      }
    },
    trackTaskCompleted: () => {
      if (!hasTrackedRef.current.has("complete-task")) {
        hasTrackedRef.current.add("complete-task");
        completeChecklistItem("complete-task");
      }
    },
    trackFileUploaded: () => {
      if (!hasTrackedRef.current.has("upload-file")) {
        hasTrackedRef.current.add("upload-file");
        completeChecklistItem("upload-file");
      }
    },
    trackStudyBuddyUsed: () => {
      if (!hasTrackedRef.current.has("use-study-buddy")) {
        hasTrackedRef.current.add("use-study-buddy");
        completeChecklistItem("use-study-buddy");
      }
    }
  };
};
