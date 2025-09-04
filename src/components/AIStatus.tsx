import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, TrendingUp, Eye } from 'lucide-react';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';

export const AIStatus: React.FC = () => {
  const { trackEvent } = useUserAnalytics();

  const aiFeatures = [
    {
      icon: Brain,
      title: "Smart Analytics",
      description: "Learning your work patterns and focus times",
      status: "Active"
    },
    {
      icon: TrendingUp,
      title: "Adaptive Recommendations", 
      description: "Suggesting optimal break times and task scheduling",
      status: "Learning"
    },
    {
      icon: Zap,
      title: "Intelligent Defaults",
      description: "Auto-adjusting timer and task settings based on your habits",
      status: "Observing"
    },
    {
      icon: Eye,
      title: "Focus Optimization",
      description: "Identifying your most productive hours and patterns",
      status: "Analyzing"
    }
  ];

  React.useEffect(() => {
    trackEvent({
      event_type: 'ai_status_viewed',
      event_data: { timestamp: new Date().toISOString() }
    });
  }, [trackEvent]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI-Powered Learning Assistant
          </CardTitle>
          <Badge variant="default" className="bg-green-500">
            Online
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium">{feature.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {feature.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>How it works:</strong> As you use the platform, AI quietly observes your patterns 
            and gradually provides personalized suggestions to improve your productivity and focus.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};