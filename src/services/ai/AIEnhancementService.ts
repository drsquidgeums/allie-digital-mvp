import { createAnthropicCompletion } from '@/utils/anthropic';

export interface AIInsight {
  id: string;
  type: 'productivity' | 'wellness' | 'learning' | 'focus' | 'motivation';
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
  actionable?: boolean;
  metadata?: Record<string, any>;
}

export interface UserPattern {
  focusTimes: string[];
  breakPreferences: string[];
  productivityPeaks: string[];
  stressIndicators: string[];
  learningStyle: string;
}

class AIEnhancementService {
  private patterns: UserPattern = {
    focusTimes: [],
    breakPreferences: [],
    productivityPeaks: [],
    stressIndicators: [],
    learningStyle: 'visual'
  };

  private insights: AIInsight[] = [];

  // Phase 1: Voice Integration Foundation
  async generateVoiceInsight(userInput: string, context?: string): Promise<string> {
    const messages = [
      {
        role: 'system' as const,
        content: `You are Allie, an AI productivity assistant. Respond conversationally and helpfully to voice queries. Keep responses concise and actionable. Focus on productivity, wellness, and learning optimization.`
      },
      {
        role: 'user' as const,
        content: `Voice input: \"${userInput}\". Context: ${context || 'General assistance'}`
      }
    ];

    const response = await createAnthropicCompletion(messages);
    return response || "I'm here to help with your productivity and wellness. Could you try asking again?";
  }

  // Phase 2: Enhanced AI Recommendations
  async generateSmartRecommendations(userActivity: any[]): Promise<AIInsight[]> {
    const activitySummary = this.summarizeActivity(userActivity);
    
    const messages = [
      {
        role: 'system' as const,
        content: `Generate 2-3 personalized productivity recommendations based on user activity patterns. Return as JSON array with fields: id, type, title, description, confidence (0-1), actionable (boolean).`
      },
      {
        role: 'user' as const,
        content: `User activity: ${JSON.stringify(activitySummary)}`
      }
    ];

    try {
      const response = await createAnthropicCompletion(messages);
      const recommendations = JSON.parse(response || '[]');
      return recommendations.map((rec: any) => ({
        ...rec,
        timestamp: new Date().toISOString(),
        metadata: { source: 'ai_enhancement' }
      }));
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  // Phase 3: Real-time AI Coaching
  async generateCoachingInsight(currentActivity: string, patterns: UserPattern): Promise<AIInsight | null> {
    const messages = [
      {
        role: 'system' as const,
        content: `Provide gentle, real-time coaching based on current activity and user patterns. Return JSON with: type, title, description, confidence. Focus on encouragement and gentle suggestions.`
      },
      {
        role: 'user' as const,
        content: `Current activity: ${currentActivity}. User patterns: ${JSON.stringify(patterns)}`
      }
    ];

    try {
      const response = await createAnthropicCompletion(messages);
      const insight = JSON.parse(response || '{}');
      return {
        id: `coaching_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actionable: true,
        metadata: { source: 'real_time_coaching' },
        ...insight
      };
    } catch (error) {
      console.error('Error generating coaching insight:', error);
      return null;
    }
  }

  // Phase 4: Advanced Document Intelligence
  async analyzeDocument(content: string, documentType: string): Promise<AIInsight[]> {
    const messages = [
      {
        role: 'system' as const,
        content: `Analyze document content and provide learning insights. Return JSON array with study tips, key concepts, and suggested learning strategies.`
      },
      {
        role: 'user' as const,
        content: `Document type: ${documentType}. Content excerpt: ${content.substring(0, 1000)}`
      }
    ];

    try {
      const response = await createAnthropicCompletion(messages);
      const insights = JSON.parse(response || '[]');
      return insights.map((insight: any) => ({
        ...insight,
        id: `doc_${Date.now()}_${Math.random()}`,
        timestamp: new Date().toISOString(),
        metadata: { source: 'document_analysis', documentType }
      }));
    } catch (error) {
      console.error('Error analyzing document:', error);
      return [];
    }
  }

  // Phase 5: Emotional Intelligence & Wellness
  async analyzeWellness(interactionData: any[]): Promise<AIInsight[]> {
    const emotionalContext = this.extractEmotionalContext(interactionData);
    
    const messages = [
      {
        role: 'system' as const,
        content: `Analyze user interaction patterns for wellness insights. Provide supportive, encouraging recommendations. Return JSON array with wellness-focused insights.`
      },
      {
        role: 'user' as const,
        content: `Interaction patterns: ${JSON.stringify(emotionalContext)}`
      }
    ];

    try {
      const response = await createAnthropicCompletion(messages);
      const insights = JSON.parse(response || '[]');
      return insights.map((insight: any) => ({
        ...insight,
        id: `wellness_${Date.now()}_${Math.random()}`,
        timestamp: new Date().toISOString(),
        type: 'wellness',
        metadata: { source: 'wellness_analysis' }
      }));
    } catch (error) {
      console.error('Error analyzing wellness:', error);
      return [];
    }
  }

  // Helper methods
  private summarizeActivity(activity: any[]): any {
    return {
      sessionCount: activity.length,
      averageDuration: activity.reduce((acc, a) => acc + (a.duration || 0), 0) / activity.length,
      commonTasks: this.extractCommonTasks(activity),
      timePatterns: this.extractTimePatterns(activity)
    };
  }

  private extractCommonTasks(activity: any[]): string[] {
    // Extract most common task types
    const taskCounts: Record<string, number> = {};
    activity.forEach(a => {
      if (a.taskType) {
        taskCounts[a.taskType] = (taskCounts[a.taskType] || 0) + 1;
      }
    });
    return Object.keys(taskCounts).sort((a, b) => taskCounts[b] - taskCounts[a]).slice(0, 3);
  }

  private extractTimePatterns(activity: any[]): string[] {
    // Extract common usage time patterns
    const hours = activity.map(a => new Date(a.timestamp || Date.now()).getHours());
    const hourCounts: Record<number, number> = {};
    hours.forEach(h => {
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });
    const peakHours = Object.keys(hourCounts)
      .sort((a, b) => hourCounts[Number(b)] - hourCounts[Number(a)])
      .slice(0, 2);
    return peakHours.map(h => `${h}:00`);
  }

  private extractEmotionalContext(interactions: any[]): any {
    return {
      sessionFrequency: interactions.length,
      errorRate: interactions.filter(i => i.type === 'error').length / interactions.length,
      completionRate: interactions.filter(i => i.type === 'completed').length / interactions.length,
      engagementLevel: this.calculateEngagement(interactions)
    };
  }

  private calculateEngagement(interactions: any[]): number {
    // Simple engagement score based on interaction patterns
    const totalInteractions = interactions.length;
    const activeInteractions = interactions.filter(i => 
      i.type !== 'idle' && i.type !== 'error'
    ).length;
    return totalInteractions > 0 ? activeInteractions / totalInteractions : 0;
  }

  // Public API methods
  updateUserPatterns(newPatterns: Partial<UserPattern>): void {
    this.patterns = { ...this.patterns, ...newPatterns };
  }

  getInsights(): AIInsight[] {
    return this.insights;
  }

  addInsight(insight: AIInsight): void {
    this.insights.unshift(insight);
    // Keep only last 50 insights
    if (this.insights.length > 50) {
      this.insights = this.insights.slice(0, 50);
    }
  }
}

export const aiEnhancementService = new AIEnhancementService();
