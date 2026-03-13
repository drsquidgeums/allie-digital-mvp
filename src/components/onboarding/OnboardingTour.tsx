import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface TooltipPosition {
  top: number;
  left: number;
  arrowPosition: "top" | "bottom" | "left" | "right";
}

export const OnboardingTour: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isTourActive,
    currentTourStep,
    tourSteps,
    nextStep,
    prevStep,
    skipTour,
    endTour,
    onboardingEnabled
  } = useOnboarding();

  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep = tourSteps[currentTourStep];

  // Handle navigation when step requires a different route
  useEffect(() => {
    if (!isTourActive || !currentStep || !onboardingEnabled) return;
    
    const requiredRoute = currentStep.route;
    if (requiredRoute && location.pathname !== requiredRoute) {
      setIsNavigating(true);
      setPosition(null);
      setHighlightRect(null);
      navigate(requiredRoute);
      
      // Wait for navigation and DOM to settle
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isTourActive, currentStep, onboardingEnabled, location.pathname, navigate]);

  const isCenteredStep = !currentStep?.target;

  useEffect(() => {
    if (!isTourActive || !currentStep || !onboardingEnabled || isNavigating) {
      if (!isTourActive || !onboardingEnabled) {
        setPosition(null);
        setHighlightRect(null);
      }
      return;
    }

    // For steps without a target, center on screen
    if (isCenteredStep) {
      setHighlightRect(null);
      const centerPosition = () => {
        if (!tooltipRef.current) return;
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        setPosition({
          top: (window.innerHeight - tooltipRect.height) / 2,
          left: (window.innerWidth - tooltipRect.width) / 2,
          arrowPosition: "top" // won't be shown
        });
      };
      const timer = setTimeout(centerPosition, 100);
      return () => clearTimeout(timer);
    }

    const updatePosition = () => {
      const target = document.querySelector(currentStep.target);
      if (!target || !tooltipRef.current) {
        return;
      }

      const targetRect = target.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      if (targetRect.width === 0 || targetRect.height === 0) {
        return;
      }
      
      setHighlightRect(targetRect);

      const padding = 16;
      let top = 0;
      let left = 0;
      let arrowPosition: "top" | "bottom" | "left" | "right" = "top";

      const placement = currentStep.placement || "bottom";

      switch (placement) {
        case "bottom":
          top = targetRect.bottom + padding;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          arrowPosition = "top";
          break;
        case "top":
          top = targetRect.top - tooltipRect.height - padding;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          arrowPosition = "bottom";
          break;
        case "left":
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.left - tooltipRect.width - padding;
          arrowPosition = "right";
          break;
        case "right":
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.right + padding;
          arrowPosition = "left";
          break;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      left = Math.max(padding, Math.min(left, viewportWidth - tooltipRect.width - padding));
      top = Math.max(padding, Math.min(top, viewportHeight - tooltipRect.height - padding));

      setPosition({ top, left, arrowPosition });
    };

    const attempts = [100, 300, 500, 800];
    const timers: NodeJS.Timeout[] = [];
    
    attempts.forEach(delay => {
      timers.push(setTimeout(updatePosition, delay));
    });

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isTourActive, currentStep, onboardingEnabled, isNavigating, isCenteredStep]);

  if (!isTourActive || !currentStep || !onboardingEnabled) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={skipTour} />
      
      {/* Highlight cutout */}
      {highlightRect && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: highlightRect.top - 4,
            left: highlightRect.left - 4,
            width: highlightRect.width + 8,
            height: highlightRect.height + 8,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
            borderRadius: "8px",
            border: "2px solid hsl(var(--primary))"
          }}
        />
      )}

      {/* Tooltip - High contrast for WCAG 3.0 compliance */}
      <div
        ref={tooltipRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-step-title"
        aria-describedby="tour-step-description"
        className={cn(
          "fixed z-[10000] p-5 w-80 rounded-xl shadow-2xl",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          // Explicit high-contrast background - white in light, dark gray in dark
          "bg-white dark:bg-zinc-900",
          // Strong border for visibility
          "border-2 border-primary ring-4 ring-primary/20"
        )}
        style={{
          top: position?.top ?? -9999,
          left: position?.left ?? -9999,
          visibility: position ? "visible" : "hidden"
        }}
      >
        {/* Arrow - hidden for centered steps */}
        {!isCenteredStep && (
          <div
            className={cn(
              "absolute w-3 h-3 rotate-45",
              "bg-white dark:bg-zinc-900",
              "border-primary",
              position?.arrowPosition === "top" && "-top-1.5 left-1/2 -translate-x-1/2 border-l-2 border-t-2",
              position?.arrowPosition === "bottom" && "-bottom-1.5 left-1/2 -translate-x-1/2 border-r-2 border-b-2",
              position?.arrowPosition === "left" && "-left-1.5 top-1/2 -translate-y-1/2 border-l-2 border-b-2",
              position?.arrowPosition === "right" && "-right-1.5 top-1/2 -translate-y-1/2 border-r-2 border-t-2"
            )}
          />
        )}

        {/* Step indicator badge */}
        <div className="absolute -top-3 left-4 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          Step {currentTourStep + 1} of {tourSteps.length}
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
          onClick={skipTour}
          aria-label="Close tour"
        >
          <X className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
        </Button>

        {/* Content - Explicit high contrast text colours */}
        <div className="pr-6 mt-2">
          <h3 
            id="tour-step-title"
            className="font-bold text-lg mb-2 text-zinc-900 dark:text-white"
          >
            {currentStep.title}
          </h3>
          <p 
            id="tour-step-description"
            className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200 mb-5"
          >
            {currentStep.description}
          </p>
        </div>

        {/* Navigation buttons - High contrast */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
          {currentTourStep > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={prevStep}
              className="border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={skipTour}
            className="text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <SkipForward className="h-4 w-4 mr-1" />
            Skip
          </Button>
          
          <Button 
            size="sm" 
            onClick={nextStep}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            {currentTourStep === tourSteps.length - 1 ? "Finish" : "Next"}
            {currentTourStep < tourSteps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </div>
    </>
  );
};
