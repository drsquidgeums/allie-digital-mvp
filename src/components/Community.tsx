
import React, { useRef, lazy, Suspense, memo, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommunityHeader } from "./community/CommunityHeader";
import { TaskPoints } from "./dashboard/TaskPoints";
import { TaskAchievements } from "./dashboard/TaskAchievements";
import { CommunityPreferences } from "./community/settings/CommunityPreferences";
import { SocialInteractionSettings } from "./community/settings/SocialInteractionSettings";
import { StudyGroupTemplate } from "./community/StudyGroupTemplate";
import { CognitiveSupportTools } from "./community/CognitiveSupportTools";
import { AccessibilityToolbar } from "./community/accessibility/AccessibilityToolbar";
import { CommunityDashboard } from "./community/dashboard/CommunityDashboard";
import { VisualStudyGroups } from "./community/visual/VisualStudyGroups";
import { VisualDiscussions } from "./community/visual/VisualDiscussions";
import { VisualResources } from "./community/visual/VisualResources";
import { useTasks } from "@/hooks/useTasks";
import { ArrowLeft, Brain, MessageSquare, Settings, Users } from "lucide-react";

// Lazy load less critical components
const CommunityChat = lazy(() => import("./community/CommunityChat").then(module => ({
  default: memo(module.CommunityChat)
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
  const [activeView, setActiveView] = useState<'dashboard' | 'study-groups' | 'discussions' | 'resources' | 'focus-tools' | 'tutor' | 'poll' | 'settings' | 'preferences' | 'social-settings'>('dashboard');
  const [preferences, setPreferences] = useState({});
  const [socialSettings, setSocialSettings] = useState({});

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setActiveView('dashboard');
      mainRef.current?.focus();
    }
  };

  const handleActionClick = (action: string) => {
    setActiveView(action as any);
  };

  const handlePreferencesChange = (newPreferences: any) => {
    setPreferences(newPreferences);
    console.log('Preferences updated:', newPreferences);
  };

  const handleSocialSettingsChange = (newSettings: any) => {
    setSocialSettings(newSettings);
    console.log('Social settings updated:', newSettings);
  };

  // Calculate points only once per render cycle
  const points = useMemo(() => calculateTotalPoints(), [calculateTotalPoints]);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <CommunityDashboard onActionClick={handleActionClick} />;
      case 'study-groups':
        return <VisualStudyGroups />;
      case 'discussions':
        return <VisualDiscussions />;
      case 'resources':
        return <VisualResources />;
      case 'focus-tools':
        return <CognitiveSupportTools />;
      case 'tutor':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <TutorCommunication />
          </Suspense>
        );
      case 'poll':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <PollBox />
          </Suspense>
        );
      case 'preferences':
        return <CommunityPreferences onPreferencesChange={handlePreferencesChange} />;
      case 'social-settings':
        return <SocialInteractionSettings onSettingsChange={handleSocialSettingsChange} />;
      default:
        return <CommunityDashboard onActionClick={handleActionClick} />;
    }
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Community Hub';
      case 'study-groups': return 'Study Groups';
      case 'discussions': return 'Discussions';
      case 'resources': return 'Resources';
      case 'focus-tools': return 'Focus Tools';
      case 'tutor': return 'Ask Your Tutor';
      case 'poll': return 'Community Poll';
      case 'preferences': return 'Accessibility Settings';
      case 'social-settings': return 'Social Support Settings';
      default: return 'Community Hub';
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
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {activeView !== 'dashboard' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveView('dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <h1 className="text-2xl font-bold">{getViewTitle()}</h1>
          </div>
          <div className="flex items-center gap-2">
            <AccessibilityToolbar />
            {activeView === 'dashboard' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveView('preferences')}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            )}
          </div>
        </div>
        
        {activeView === 'dashboard' && (
          <>
            <TaskPoints points={points} />
            <TaskAchievements 
              points={points} 
              isOpen={showAchievement}
              onClose={() => setShowAchievement(false)}
            />
          </>
        )}
        
        {renderContent()}
      </div>
    </Card>
  );
});

Community.displayName = "Community";
