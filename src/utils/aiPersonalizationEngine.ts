import { createAnthropicCompletion } from './anthropic';

interface AnalyticsData {
  event_type: string;
  event_data: Record<string, any>;
  timestamp: string;
}

interface UserContext {
  currentTime: Date;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: string;
  recentActivity: AnalyticsData[];
  effectivenessData?: Array<{
    recommendation_type: string;
    success_rate: number;
    avg_rating: number;
  }>;
}

interface EnhancedInsight {
  type: 'action' | 'setting' | 'warning' | 'insight' | 'prediction' | 'optimization';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timing: 'now' | 'soon' | 'later' | 'scheduled';
  confidence: number;
  reasoning: string;
  content: string;
  actionable: boolean;
  context: Record<string, any>;
}

export class AIPersonalizationEngine {
  private getUserContext(analytics: AnalyticsData[]): UserContext {
    const now = new Date();
    const hour = now.getHours();
    const timeOfDay = hour < 6 ? 'night' : 
                     hour < 12 ? 'morning' : 
                     hour < 18 ? 'afternoon' : 
                     hour < 22 ? 'evening' : 'night';

    return {
      currentTime: now,
      timeOfDay,
      dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
      recentActivity: analytics.slice(0, 20) // Last 20 activities
    };
  }

  private analyzeProductivityPatterns(analytics: AnalyticsData[]): Record<string, any> {
    const patterns = {
      peak_hours: [] as number[],
      focus_duration_avg: 0,
      break_frequency: 0,
      tool_preferences: {} as Record<string, number>,
      completion_rate: 0,
      stress_indicators: [] as string[]
    };

    // Analyze timing patterns
    const hourlyActivity = analytics.reduce((acc, event) => {
      const hour = new Date(event.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Find peak hours (top 3 most active hours)
    patterns.peak_hours = Object.entries(hourlyActivity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    // Analyze focus sessions
    const pomodoroSessions = analytics.filter(e => e.event_type === 'pomodoro_session');
    if (pomodoroSessions.length > 0) {
      const totalDuration = pomodoroSessions.reduce((sum, session) => 
        sum + (session.event_data.duration || 0), 0);
      patterns.focus_duration_avg = totalDuration / pomodoroSessions.length;
      
      const completedSessions = pomodoroSessions.filter(s => s.event_data.completed);
      patterns.completion_rate = completedSessions.length / pomodoroSessions.length;
    }

    // Analyze tool usage
    const toolEvents = analytics.filter(e => e.event_type === 'tool_usage');
    toolEvents.forEach(event => {
      const tool = event.event_data.tool;
      patterns.tool_preferences[tool] = (patterns.tool_preferences[tool] || 0) + 1;
    });

    // Detect stress indicators
    const rapidSwitching = analytics.filter((event, index) => {
      if (index === 0) return false;
      const prevEvent = analytics[index - 1];
      const timeDiff = new Date(event.timestamp).getTime() - new Date(prevEvent.timestamp).getTime();
      return timeDiff < 30000 && event.event_type !== prevEvent.event_type; // Switching tools in <30s
    });

    if (rapidSwitching.length > analytics.length * 0.3) {
      patterns.stress_indicators.push('rapid_tool_switching');
    }

    return patterns;
  }

  async generateEnhancedInsights(
    analytics: AnalyticsData[], 
    effectivenessData?: Array<{ recommendation_type: string; success_rate: number; avg_rating: number; }>
  ): Promise<EnhancedInsight[]> {
    const context = this.getUserContext(analytics);
    const patterns = this.analyzeProductivityPatterns(analytics);

    const prompt = `You are an advanced AI productivity coach analyzing user behavior patterns. Generate personalized insights based on deep analysis.

USER CONTEXT:
- Current time: ${context.timeOfDay} on ${context.dayOfWeek}
- Recent activity: ${context.recentActivity.length} events in last session

PRODUCTIVITY PATTERNS DETECTED:
- Peak productivity hours: ${patterns.peak_hours.join(', ')}
- Average focus duration: ${patterns.focus_duration_avg} minutes
- Task completion rate: ${(patterns.completion_rate * 100).toFixed(1)}%
- Most used tools: ${Object.entries(patterns.tool_preferences).slice(0, 3).map(([tool, count]) => `${tool}(${count})`).join(', ')}
- Stress indicators: ${patterns.stress_indicators.join(', ') || 'none detected'}

RECENT ACTIVITY SAMPLE:
${context.recentActivity.slice(0, 5).map(event => 
  `- ${event.event_type}: ${JSON.stringify(event.event_data).substring(0, 100)}`
).join('\n')}

${effectivenessData ? `
RECOMMENDATION EFFECTIVENESS HISTORY:
${effectivenessData.map(data => 
  `- ${data.recommendation_type}: ${(data.success_rate * 100).toFixed(1)}% success rate, ${data.avg_rating.toFixed(1)}/5 rating`
).join('\n')}` : ''}

Generate 4-6 highly personalized insights. Consider:
1. Current context and optimal timing
2. User's proven patterns and preferences  
3. Predictive suggestions based on behavioral trends
4. Micro-optimizations for immediate impact
5. Strategic recommendations for long-term improvement

Respond in JSON format:
{
  "insights": [
    {
      "type": "action|setting|warning|insight|prediction|optimization",
      "priority": "low|medium|high|urgent",
      "timing": "now|soon|later|scheduled", 
      "confidence": 0.0-1.0,
      "reasoning": "Brief explanation of why this insight is relevant",
      "content": "The actual recommendation text",
      "actionable": true|false,
      "context": {
        "trigger": "what prompted this insight",
        "expected_outcome": "what this should achieve",
        "timing_rationale": "why this timing is optimal"
      }
    }
  ]
}`;

    try {
      const response = await createAnthropicCompletion([
        { 
          role: 'system', 
          content: 'You are an expert AI productivity coach that provides personalized, actionable insights based on deep behavioral analysis. Always respond with valid JSON.' 
        },
        { role: 'user', content: prompt }
      ]);

      if (response) {
        const parsed = JSON.parse(response);
        return parsed.insights || [];
      }
    } catch (error) {
      console.error('Failed to generate enhanced insights:', error);
    }

    // Fallback insights if AI fails
    return this.generateFallbackInsights(context, patterns);
  }

  private generateFallbackInsights(context: UserContext, patterns: Record<string, any>): EnhancedInsight[] {
    const insights: EnhancedInsight[] = [];

    // Time-based suggestion
    if (context.timeOfDay === 'morning' && patterns.peak_hours.includes(new Date().getHours())) {
      insights.push({
        type: 'action',
        priority: 'high',
        timing: 'now',
        confidence: 0.8,
        reasoning: 'You\'re in your peak productivity hours',
        content: 'This is one of your most productive hours. Consider tackling your most challenging task now.',
        actionable: true,
        context: {
          trigger: 'peak_hour_detection',
          expected_outcome: 'improved_task_completion',
          timing_rationale: 'historical_performance_data'
        }
      });
    }

    // Completion rate insight
    if (patterns.completion_rate < 0.7) {
      insights.push({
        type: 'optimization',
        priority: 'medium',
        timing: 'soon',
        confidence: 0.75,
        reasoning: 'Your task completion rate could be improved',
        content: 'Try shorter focus sessions (15-20 min) to boost your completion rate.',
        actionable: true,
        context: {
          trigger: 'low_completion_rate',
          expected_outcome: 'higher_completion_rate',
          timing_rationale: 'gradual_habit_change'
        }
      });
    }

    return insights;
  }
}

export const aiPersonalizationEngine = new AIPersonalizationEngine();