
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Heart, Users, CheckCircle } from "lucide-react";

interface SafeSpaceIndicatorProps {
  features: string[];
  size?: "sm" | "md" | "lg";
}

export const SafeSpaceIndicator = ({ features, size = "sm" }: SafeSpaceIndicatorProps) => {
  const safeSpaceFeatures = [
    { key: "neurodivergent-friendly", label: "Neurodivergent Friendly", icon: Heart },
    { key: "structured-communication", label: "Structured Communication", icon: Users },
    { key: "patient-environment", label: "Patient Environment", icon: Shield },
    { key: "verified-safe", label: "Verified Safe Space", icon: CheckCircle }
  ];

  const activeFeaturesData = safeSpaceFeatures.filter(feature => 
    features.includes(feature.key)
  );

  if (activeFeaturesData.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {activeFeaturesData.map(({ key, label, icon: Icon }) => (
        <TooltipProvider key={key}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="secondary" 
                className={`
                  bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 
                  flex items-center gap-1 border-green-200 dark:border-green-800
                  ${size === 'sm' ? 'text-xs px-2 py-0.5' : ''}
                  ${size === 'md' ? 'text-sm px-2 py-1' : ''}
                  ${size === 'lg' ? 'text-base px-3 py-1' : ''}
                `}
              >
                <Icon className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
                {size === 'lg' && label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
