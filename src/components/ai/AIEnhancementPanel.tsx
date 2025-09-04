import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Mic, Brain, FileText, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { VoiceAssistant } from './VoiceAssistant';
import { SmartRecommendations } from './SmartRecommendations';
import { RealTimeCoaching } from './RealTimeCoaching';
import { DocumentIntelligence } from './DocumentIntelligence';
import { WellnessMonitor } from './WellnessMonitor';

interface AIEnhancementPanelProps {
  className?: string;
  currentActivity?: string;
  documentContent?: string;
  documentType?: string;
  fileName?: string;
}

export const AIEnhancementPanel: React.FC<AIEnhancementPanelProps> = ({
  className = '',
  currentActivity = 'general',
  documentContent,
  documentType,
  fileName
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');

  const handleVoiceResponse = (response: string) => {
    console.log('Voice response:', response);
    // Could display response in a toast or dedicated area
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isExpanded) {
    // Compact mode - floating panel with key features
    return (
      <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
        <Card className="w-80 shadow-lg border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Assistant
              </CardTitle>
              <div className="flex items-center gap-1">
                <VoiceAssistant 
                  className="mr-2" 
                  onResponse={handleVoiceResponse}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpanded}
                  className="h-6 w-6 p-0"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 space-y-3">
            {/* Real-time coaching overlay */}
            <RealTimeCoaching currentActivity={currentActivity} />
            
            {/* Smart recommendations */}
            <SmartRecommendations maxItems={2} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Expanded mode - full AI enhancement panel
  return (
    <div className={`fixed top-0 right-0 h-full w-96 bg-background border-l border-border shadow-2xl z-40 ${className}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">AI Enhancement Suite</h2>
          </div>
          <div className="flex items-center gap-2">
            <VoiceAssistant onResponse={handleVoiceResponse} />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommendations" className="text-xs">
                <Brain className="w-3 h-3 mr-1" />
                Smart
              </TabsTrigger>
              <TabsTrigger value="coaching" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Coach
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-xs">
                <FileText className="w-3 h-3 mr-1" />
                Docs
              </TabsTrigger>
              <TabsTrigger value="wellness" className="text-xs">
                <Heart className="w-3 h-3 mr-1" />
                Health
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              <SmartRecommendations maxItems={5} />
            </TabsContent>

            <TabsContent value="coaching" className="space-y-4">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Real-time coaching adapts to your current activity and provides gentle guidance.
                </div>
                <RealTimeCoaching currentActivity={currentActivity} />
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <DocumentIntelligence
                documentContent={documentContent}
                documentType={documentType}
                fileName={fileName}
              />
            </TabsContent>

            <TabsContent value="wellness" className="space-y-4">
              <WellnessMonitor />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Backdrop when expanded */}
      <div 
        className="fixed inset-0 bg-black/20 z-30"
        onClick={toggleExpanded}
      />
    </div>
  );
};