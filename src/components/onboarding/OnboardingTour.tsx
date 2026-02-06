import React, { useEffect, useState, useRef } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface TooltipPosition {
  top: number;
  left: number;
  arrowPosition: "top" | "bottom" | "left" | "right";
}

export const OnboardingTour: React.FC = () => {
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
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep = tourSteps[currentTourStep];

  useEffect(() => {
    if (!isTourActive || !currentStep || !onboardingEnabled) {
      setPosition(null);
      setHighlightRect(null);
      return;
    }

    const updatePosition = () => {
      const target = document.querySelector(currentStep.target);
      if (!target || !tooltipRef.current) return;

      const targetRect = target.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
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

      // Keep tooltip in viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      left = Math.max(padding, Math.min(left, viewportWidth - tooltipRect.width - padding));
      top = Math.max(padding, Math.min(top, viewportHeight - tooltipRect.height - padding));

      setPosition({ top, left, arrowPosition });
    };

    // Initial position
    setTimeout(updatePosition, 100);

    // Update on resize/scroll
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isTourActive, currentStep, onboardingEnabled]);

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

      {/* Tooltip */}
      <Card
        ref={tooltipRef}
        className={cn(
          "fixed z-[10000] p-4 w-80 shadow-xl border-primary/20",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
        style={{
          top: position?.top ?? -9999,
          left: position?.left ?? -9999,
          visibility: position ? "visible" : "hidden"
        }}
      >
        {/* Arrow */}
        <div
          className={cn(
            "absolute w-3 h-3 bg-card border rotate-45",
            position?.arrowPosition === "top" && "-top-1.5 left-1/2 -translate-x-1/2 border-l border-t",
            position?.arrowPosition === "bottom" && "-bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b",
            position?.arrowPosition === "left" && "-left-1.5 top-1/2 -translate-y-1/2 border-l border-b",
            position?.arrowPosition === "right" && "-right-1.5 top-1/2 -translate-y-1/2 border-r border-t"
          )}
        />

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={skipTour}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Content */}
        <div className="pr-6">
          <h3 className="font-semibold text-lg mb-2">{currentStep.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{currentStep.description}</p>
        </div>

        {/* Progress & Navigation */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {currentTourStep + 1} of {tourSteps.length}
          </span>
          
          <div className="flex gap-2">
            {currentTourStep > 0 && (
              <Button variant="outline" size="sm" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            
            <Button variant="ghost" size="sm" onClick={skipTour}>
              <SkipForward className="h-4 w-4 mr-1" />
              Skip
            </Button>
            
            <Button size="sm" onClick={nextStep}>
              {currentTourStep === tourSteps.length - 1 ? "Finish" : "Next"}
              {currentTourStep < tourSteps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};
