import React, { useRef, lazy, Suspense, memo } from "react";
import { Card } from "@/components/ui/card";
import { CommunityHeader } from "./community/CommunityHeader";
import { CommunityStats } from "./community/CommunityStats";
import { TaskPoints } from "./dashboard/TaskPoints";
import { TaskAchievements } from "./dashboard/TaskAchievements";
import { useTasks } from "@/hooks/useTasks";

// Lazy load less critical components
const DiscussionList = lazy(() => import("./community/DiscussionList").then(module => ({
  default: module.DiscussionList
})));
const CommunityChat = lazy(() => import("./community/CommunityChat").then(module => ({
  default: module.CommunityChat
})));
const ResourceShare = lazy(() => import("./community/ResourceShare").then(module => ({
  default: module.ResourceShare
})));
const StudyGroups = lazy(() => import("./community/StudyGroups").then(module => ({
  default: module.StudyGroups
})));
const CollaborationActivity = lazy(() => import("./community/CollaborationActivity").then(module => ({
  default: module.CollaborationActivity
})));
const TutorCommunication = lazy(() => import("./community/TutorCommunication").then(module => ({
  default: module.default
})));
const PollBox = lazy(() => import("./community/PollBox").then(module => ({
  default: module.PollBox
})));

const LoadingComponent = () => (
  <div className="flex items-center justify-center p-6 bg-muted/20 rounded-lg min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export const Community = memo(() => {
  const mainRef = useRef<HTMLDivElement>(null);
  const { calculateTotalPoints, showAchievement, setShowAchievement } = useTasks();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      mainRef.current?.focus();
    }
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
        <TaskPoints points={calculateTotalPoints()} />
        <TaskAchievements 
          points={calculateTotalPoints()} 
          isOpen={showAchievement}
          onClose={() => setShowAchievement(false)}
        />
        <CommunityStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
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
      </div>
    </Card>
  );
});

Community.displayName = "Community";
