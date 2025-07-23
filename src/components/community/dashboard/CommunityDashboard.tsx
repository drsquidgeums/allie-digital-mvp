
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  Brain, 
  Calendar,
  HelpCircle,
  BarChart3,
  Settings
} from "lucide-react";

interface ActionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  count?: number;
  status?: string;
  onClick: () => void;
  color?: string;
}

const ActionCard = ({ icon: Icon, title, description, count, status, onClick, color = "bg-primary" }: ActionCardProps) => (
  <Card 
    className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-primary/20"
    onClick={onClick}
  >
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-xl ${color}/10 mb-3`}>
        <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      {count && (
        <Badge variant="secondary" className="text-xs">
          {count}
        </Badge>
      )}
    </div>
    <h3 className="font-semibold text-lg mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground mb-2">{description}</p>
    {status && (
      <Badge variant="outline" className="text-xs">
        {status}
      </Badge>
    )}
  </Card>
);

interface CommunityDashboardProps {
  onActionClick: (action: string) => void;
}

export const CommunityDashboard = ({ onActionClick }: CommunityDashboardProps) => {
  const quickActions = [
    {
      icon: Users,
      title: "Study Groups",
      description: "Join or create study sessions",
      count: 12,
      status: "3 active",
      color: "bg-blue-500",
      action: "study-groups"
    },
    {
      icon: MessageSquare,
      title: "Discussions",
      description: "Share ideas and get help",
      count: 24,
      status: "5 new",
      color: "bg-green-500",
      action: "discussions"
    },
    {
      icon: BookOpen,
      title: "Resources",
      description: "Access study materials",
      count: 156,
      color: "bg-purple-500",
      action: "resources"
    },
    {
      icon: Brain,
      title: "Focus Tools",
      description: "Cognitive support features",
      color: "bg-orange-500",
      action: "focus-tools"
    },
    {
      icon: Calendar,
      title: "Events",
      description: "Upcoming study sessions",
      count: 8,
      color: "bg-pink-500",
      action: "events"
    },
    {
      icon: HelpCircle,
      title: "Ask Tutor",
      description: "Get expert guidance",
      status: "Online",
      color: "bg-cyan-500",
      action: "tutor"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">892</div>
          <div className="text-sm text-blue-600/80 dark:text-blue-400/80">Active Members</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">71</div>
          <div className="text-sm text-green-600/80 dark:text-green-400/80">Live Discussions</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">156</div>
          <div className="text-sm text-purple-600/80 dark:text-purple-400/80">Shared Resources</div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <ActionCard
            key={action.action}
            {...action}
            onClick={() => onActionClick(action.action)}
          />
        ))}
      </div>

      {/* Quick Access Bar */}
      <div className="flex gap-2 justify-center">
        <Button variant="outline" size="sm" onClick={() => onActionClick('poll')}>
          <BarChart3 className="h-4 w-4 mr-2" />
          Poll
        </Button>
      </div>
    </div>
  );
};
