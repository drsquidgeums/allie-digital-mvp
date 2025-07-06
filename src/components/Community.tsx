
import React, { useRef, lazy, Suspense, memo, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommunityHeader } from "./community/CommunityHeader";
import { CommunityStats } from "./community/CommunityStats";
import { TaskPoints } from "./dashboard/TaskPoints";
import { TaskAchievements } from "./dashboard/TaskAchievements";
import { CommunityPreferences } from "./community/settings/CommunityPreferences";
import { StudyGroupTemplate } from "./community/StudyGroupTemplate";
import { CognitiveSupportTools } from "./community/CognitiveSupportTools";
import { useTasks } from "@/hooks/useTasks";
import { Settings, Brain, Users } from "lucide-react";

// Lazy load less critical components
const DiscussionList = lazy(() => import("./community/DiscussionList").then(module => ({
  default: memo(module.DiscussionList)
})));
const CommunityChat = lazy(() => import("./community/CommunityChat").then(module => ({
  default: memo(module.CommunityChat)
})));
const ResourceShare = lazy(() => import("./community/ResourceShare").then(module => ({
  default: memo(module.ResourceShare)
})));
const StudyGroups = lazy(() => import("./community/StudyGroups").then(module => ({
  default: memo(module.StudyGroups)
})));
const CollaborationActivity = lazy(() => import("./community/CollaborationActivity").then(module => ({
  default: memo(module.default)
})));
const TutorCommunication = lazy(() => import("./community/TutorCommunication").then(module => ({
  default: memo(module.default)
})));
const PollBox = lazy(() => import("./community/PollBox").then(module => ({
  default: memo(module.PollBox)
})));

const LoadingComponent = memo(() => (
  <div className="flex items-center justify-center p-6 bg-muted/20 rounded-lg min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
));

LoadingComponent.displayName = "LoadingComponent";

export const Community = memo(() => {
  const mainRef = useRef<HTMLDivElement>(null);
  const { calculateTotalPoints, showAchievement, setShowAchievement } = useTasks();
  const [activeView, setActiveView] = useState<'community' | 'preferences' | 'cognitive-tools'>('community');
  const [preferences, setPreferences] = useState({});

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      mainRef.current?.focus();
    }
  };

  const handleCreateStructuredGroup = (groupData: any) => {
    console.log('Creating structured group:', groupData);
    // This would integrate with the existing StudyGroups component
  };

  const handlePreferencesChange = (newPreferences: any) => {
    setPreferences(newPreferences);
    // Apply preferences to the UI
    console.log('Preferences updated:', newPreferences);
  };

  // Calculate points only once per render cycle
  const points = useMemo(() => calculateTotalPoints(), [calculateTotalPoints]);

  const renderContent = () => {
    if (activeView === 'preferences') {
      return <CommunityPreferences onPreferencesChange={handlePreferencesChange} />;
    }
    
    if (activeView === 'cognitive-tools') {
      return <CognitiveSupportTools />;
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <StudyGroupTemplate onCreateGroup={handleCreateStructuredGroup} />
          <Suspense fallback={<LoadingComponent />}>
            <CollaborationActivity />
          </Suspense>
          <Suspense fallback={<LoadingComponent />}>
            <DiscussionList />
          </Suspense>
          <Suspense fallback={<LoadingComponent />}>
            <TutorCommunication />
          </Suspense>
          <Suspense fallback={<LoadingComponent />}>
            <CommunityChat />
          </Suspense>
          <Suspense fallback={<LoadingComponent />}>
            <PollBox />
          </Suspense>
        </div>
        <div className="space-y-4">
          <Suspense fallback={<LoadingComponent />}>
            <ResourceShare />
          </Suspense>
          <Suspense fallback={<LoadingComponent />}>
            <StudyGroups />
          </Suspense>
        </div>
      </div>
    );
  };

  return (
    <Card 
      className="h-full bg-card text-card-foreground animate-fade-in rounded-xl overflow-hidden relative border-none shadow-lg ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      role="region"
      aria-label="Community Dashboard"
      onKeyDown={handleKeyDown}
      ref={mainRef}
    >
      <div className="p-4 space-y-4">
        <CommunityHeader />
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b">
          <Button
            variant={activeView === 'community' ? 'default' : 'ghost'}
            onClick={() => setActiveView('community')}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Community
          </Button>
          <Button
            variant={activeView === 'cognitive-tools' ? 'default' : 'ghost'}
            onClick={() => setActiveView('cognitive-tools')}
            className="gap-2"
          >
            <Brain className="h-4 w-4" />
            Cognitive Tools
          </Button>
          <Button
            variant={activeView === 'preferences' ? 'default' : 'ghost'}
            onClick={() => setActiveView('preferences')}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Accessibility
          </Button>
        </div>
        
        {activeView === 'community' && (
          <>
            <TaskPoints points={points} />
            <TaskAchievements 
              points={points} 
              isOpen={showAchievement}
              onClose={() => setShowAchievement(false)}
            />
            <CommunityStats />
          </>
        )}
        
        {renderContent()}
      </div>
    </Card>
  );
});

Community.displayName = "Community";
