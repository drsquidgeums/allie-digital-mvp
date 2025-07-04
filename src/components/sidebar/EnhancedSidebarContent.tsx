
import React, { useState, useEffect } from "react";
import { useMicroInteractions } from "@/hooks/useMicroInteractions";

interface EnhancedSidebarContentProps {
  activeComponent: string | null;
  onColorChange: (color: string) => void;
  children: React.ReactNode;
}

export const EnhancedSidebarContent: React.FC<EnhancedSidebarContentProps> = ({ 
  activeComponent,
  onColorChange,
  children
}) => {
  const [previousComponent, setPreviousComponent] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { triggerInteraction } = useMicroInteractions();

  useEffect(() => {
    if (activeComponent !== previousComponent) {
      setIsTransitioning(true);
      
      // Smooth transition between components
      triggerInteraction(
        () => {
          setPreviousComponent(activeComponent);
        },
        {
          duration: 300,
          onComplete: () => {
            setIsTransitioning(false);
          }
        }
      );
    }
  }, [activeComponent, previousComponent, triggerInteraction]);

  return (
    <div className="flex-1 overflow-hidden">
      <div 
        className={`h-full tool-transition ${
          isTransitioning ? 'tool-fade-out' : 'tool-fade-in'
        }`}
        key={activeComponent || 'empty'}
      >
        <div className="p-4 h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
