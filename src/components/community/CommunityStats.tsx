
import React from "react";
import { Users, MessageSquare, Book } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const CommunityStats = () => {
  const stats = [
    {
      icon: Users,
      label: "Active Members",
      value: 892,
    },
    {
      icon: MessageSquare,
      label: "Discussions",
      value: 71,
    },
    {
      icon: Book,
      label: "Resources",
      value: 156,
    },
  ];

  return (
    <div className="flex items-center gap-6">
      {stats.map(({ icon: Icon, label, value }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-semibold">{value}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom" 
            className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
          >
            {label}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
