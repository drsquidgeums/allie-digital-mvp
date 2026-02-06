import React, { useMemo, useCallback, useEffect, useRef } from "react";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { useTasks } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { 
  format, 
  subDays, 
  startOfDay, 
  eachDayOfInterval,
  getDay,
  getHours,
  differenceInDays
} from "date-fns";
import { Flame, TrendingUp, Clock, Target, Calendar, Zap } from "lucide-react";
import { AIInsightsPanel } from "@/components/progress/AIInsightsPanel";
import { useProgressAI, InsightType, ProgressData } from "@/hooks/useProgressAI";
import { useOnboarding } from "@/contexts/OnboardingContext";

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))"
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ProgressDashboard = React.memo(() => {
  const { tasks } = useTasks();
  const { insights, generateInsight, generateAllInsights } = useProgressAI();
  const { completeChecklistItem, onboardingEnabled } = useOnboarding();
  const hasTrackedRef = useRef(false);

  // Track progress page visit for onboarding
  useEffect(() => {
    if (!onboardingEnabled || hasTrackedRef.current) return;
    hasTrackedRef.current = true;
    completeChecklistItem("check-progress");
  }, [completeChecklistItem, onboardingEnabled]);

  // Calculate streak data
  const streakData = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) {
      return { currentStreak: 0, longestStreak: 0, streakDays: [] };
    }

    // Get unique dates with completed tasks
    const completionDates = new Set(
      completedTasks.map(t => startOfDay(new Date(t.createdAt)).getTime())
    );

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = startOfDay(new Date());
    
    // Check if today has completions
    if (completionDates.has(checkDate.getTime())) {
      currentStreak = 1;
      checkDate = subDays(checkDate, 1);
    } else {
      // Check if yesterday has completions (streak might still be active)
      checkDate = subDays(checkDate, 1);
      if (!completionDates.has(checkDate.getTime())) {
        return { currentStreak: 0, longestStreak: 0, streakDays: Array.from(completionDates) };
      }
      currentStreak = 1;
      checkDate = subDays(checkDate, 1);
    }

    // Count consecutive days backwards
    while (completionDates.has(checkDate.getTime())) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    }

    // Calculate longest streak
    const sortedDates = Array.from(completionDates).sort((a, b) => a - b);
    let longestStreak = 1;
    let tempStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const diff = differenceInDays(new Date(sortedDates[i]), new Date(sortedDates[i - 1]));
      if (diff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    return { 
      currentStreak, 
      longestStreak: Math.max(longestStreak, currentStreak),
      streakDays: sortedDates 
    };
  }, [tasks]);

  // Weekly trend data (last 7 days)
  const weeklyTrend = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date()
    });

    return last7Days.map(day => {
      const dayStart = startOfDay(day).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      
      const completed = tasks.filter(t => {
        const taskDate = new Date(t.createdAt).getTime();
        return t.completed && taskDate >= dayStart && taskDate < dayEnd;
      }).length;

      const added = tasks.filter(t => {
        const taskDate = new Date(t.createdAt).getTime();
        return taskDate >= dayStart && taskDate < dayEnd;
      }).length;

      return {
        day: format(day, "EEE"),
        completed,
        added,
        date: format(day, "d MMM")
      };
    });
  }, [tasks]);

  // Focus time analysis (hour of day patterns)
  const focusAnalysis = useMemo(() => {
    const hourCounts: Record<number, number> = {};
    const dayCounts: Record<number, number> = {};

    tasks.filter(t => t.completed).forEach(task => {
      const date = new Date(task.createdAt);
      const hour = getHours(date);
      const day = getDay(date);

      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    // Find peak productivity hour
    let peakHour = 0;
    let maxHourCount = 0;
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxHourCount) {
        maxHourCount = count;
        peakHour = parseInt(hour);
      }
    });

    // Find most productive day
    let peakDay = 0;
    let maxDayCount = 0;
    Object.entries(dayCounts).forEach(([day, count]) => {
      if (count > maxDayCount) {
        maxDayCount = count;
        peakDay = parseInt(day);
      }
    });

    // Hour distribution for chart
    const hourData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: i === 0 ? "12am" : i < 12 ? `${i}am` : i === 12 ? "12pm" : `${i - 12}pm`,
      count: hourCounts[i] || 0
    }));

    // Day distribution for pie chart
    const dayData = DAY_NAMES.map((name, i) => ({
      name,
      value: dayCounts[i] || 0
    }));

    return {
      peakHour,
      peakDay: DAY_NAMES[peakDay],
      hourData,
      dayData,
      totalCompleted: tasks.filter(t => t.completed).length
    };
  }, [tasks]);

  // Streak calendar (last 30 days)
  const streakCalendar = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date()
    });

    return last30Days.map(day => {
      const dayStart = startOfDay(day).getTime();
      const hasActivity = tasks.some(t => {
        const taskDate = startOfDay(new Date(t.createdAt)).getTime();
        return t.completed && taskDate === dayStart;
      });

      return {
        date: day,
        hasActivity
      };
    });
  }, [tasks]);

  const formatPeakHour = (hour: number) => {
    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return "12:00 PM";
    return `${hour - 12}:00 PM`;
  };

  // Prepare progress data for AI insights
  const progressData: ProgressData = useMemo(() => ({
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    totalCompleted: focusAnalysis.totalCompleted,
    activeDays: streakData.streakDays.length,
    peakHour: focusAnalysis.peakHour,
    peakDay: focusAnalysis.peakDay,
    weeklyTrend: weeklyTrend,
    dayDistribution: focusAnalysis.dayData,
  }), [streakData, focusAnalysis, weeklyTrend]);

  const handleGenerateInsight = useCallback((type: InsightType) => {
    generateInsight(type, progressData);
  }, [generateInsight, progressData]);

  const handleGenerateAll = useCallback(() => {
    generateAllInsights(progressData);
  }, [generateAllInsights, progressData]);

  const isAnyLoading = Object.values(insights).some(i => i.loading);

  return (
    <WorkspaceLayout>
      <div className="p-6 h-full overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Progress Dashboard</h1>
          <p className="text-muted-foreground">
            Track your productivity streaks, trends, and focus patterns
          </p>
        </div>

        {/* AI Insights Panel */}
        <AIInsightsPanel
          insights={insights}
          onGenerate={handleGenerateInsight}
          onGenerateAll={handleGenerateAll}
          isAnyLoading={isAnyLoading}
        />

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/10 hover:shadow-lg hover:shadow-primary/10 transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/20 ring-2 ring-primary/30">
                  <Flame className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold text-primary">{streakData.currentStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-2/20 bg-gradient-to-br from-card to-chart-2/10 hover:shadow-lg hover:shadow-chart-2/10 transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-chart-2/20 ring-2 ring-chart-2/30">
                  <Target className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Longest Streak</p>
                  <p className="text-2xl font-bold text-chart-2">{streakData.longestStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-3/20 bg-gradient-to-br from-card to-chart-3/10 hover:shadow-lg hover:shadow-chart-3/10 transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-chart-3/20 ring-2 ring-chart-3/30">
                  <Clock className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Peak Hour</p>
                  <p className="text-2xl font-bold text-chart-3">{formatPeakHour(focusAnalysis.peakHour)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-chart-4/20 bg-gradient-to-br from-card to-chart-4/10 hover:shadow-lg hover:shadow-chart-4/10 transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-chart-4/20 ring-2 ring-chart-4/30">
                  <Zap className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Best Day</p>
                  <p className="text-2xl font-bold text-chart-4">{focusAnalysis.peakDay}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streak Calendar */}
        <Card className="mb-6 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-primary/15">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              30-Day Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {streakCalendar.map((day, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm transition-all hover:scale-125 cursor-default ${
                    day.hasActivity 
                      ? "bg-gradient-to-br from-primary to-chart-2 shadow-sm shadow-primary/30" 
                      : "bg-muted/50 hover:bg-muted"
                  }`}
                  title={format(day.date, "d MMM yyyy")}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              <span className="text-primary font-medium">{focusAnalysis.totalCompleted}</span> tasks completed • <span className="text-chart-2 font-medium">{streakData.streakDays.length}</span> active days
            </p>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly Trend */}
          <Card className="border-chart-3/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-chart-3/15">
                  <TrendingUp className="h-5 w-5 text-chart-3" />
                </div>
                Weekly Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrend}>
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar 
                      dataKey="completed" 
                      fill="hsl(var(--primary))" 
                      name="Completed"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="added" 
                      fill="hsl(var(--muted-foreground))" 
                      name="Added"
                      radius={[4, 4, 0, 0]}
                      opacity={0.5}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Hourly Distribution */}
          <Card className="border-chart-4/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-chart-4/15">
                  <Clock className="h-5 w-5 text-chart-4" />
                </div>
                Focus Time Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={focusAnalysis.hourData}>
                    <XAxis 
                      dataKey="label"
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      interval={3}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                      formatter={(value: number) => [`${value} tasks`, "Completed"]}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Day of Week Distribution */}
        <Card className="border-chart-2/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-chart-2/15">
                <Calendar className="h-5 w-5 text-chart-2" />
              </div>
              Productivity by Day of Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={focusAnalysis.dayData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number) => [`${value} tasks`, "Completed"]}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkspaceLayout>
  );
});

ProgressDashboard.displayName = "ProgressDashboard";

export default ProgressDashboard;
