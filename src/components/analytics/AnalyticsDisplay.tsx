
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";

export const AnalyticsDisplay = () => {
  const { getProductivityMetrics } = useAnalytics();
  const metrics = getProductivityMetrics();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Productivity Insights</CardTitle>
          <CardDescription>Your daily and weekly activity summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{metrics.todayActivity}</div>
              <p className="text-sm text-muted-foreground">Today's Activities</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{metrics.weeklyActivity}</div>
              <p className="text-sm text-muted-foreground">This Week</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Average Reading Speed:</span>
              <Badge variant="secondary">{metrics.averageReadingSpeed} WPM</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Most Used Tool:</span>
              <Badge variant="outline">{metrics.mostUsedTool}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
