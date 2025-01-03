import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Home,
  Layout,
  CheckSquare,
  Brain,
  MessageSquare,
  Users,
  Search
} from "lucide-react";

export const Launcher = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const apps = [
    { icon: Home, label: "Home", route: "/" },
    { icon: CheckSquare, label: "Tasks", route: "/tasks" },
    { icon: Brain, label: "Mind Map", route: "/mind-map" },
    { icon: MessageSquare, label: "AI Assistant", route: "/ai-assistant" },
    { icon: Users, label: "Community", route: "/community" },
  ];

  const filteredApps = apps.filter(app => 
    app.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="absolute inset-x-0 bottom-0 bg-workspace p-6 rounded-t-xl shadow-lg animate-in slide-in-from-bottom">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search apps..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            {filteredApps.map((app) => (
              <Button
                key={app.route}
                variant="ghost"
                className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-accent"
                onClick={() => {
                  navigate(app.route);
                  onClose();
                }}
              >
                <app.icon className="h-8 w-8" />
                <span className="text-sm">{app.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};