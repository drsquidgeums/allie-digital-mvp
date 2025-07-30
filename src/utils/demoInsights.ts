import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createOpenAICompletion } from '@/utils/openai';

// Generate demo insights for testing
export const generateDemoInsights = async (userId: string) => {
  if (!userId) return;

  try {
    // Create some sample analytics data
    const sampleEvents = [
      {
        user_id: userId,
        event_type: 'pomodoro_session',
        event_data: { duration: 25, completed: true },
        session_id: crypto.randomUUID(),
      },
      {
        user_id: userId,
        event_type: 'task_action',
        event_data: { action: 'created', category: 'work' },
        session_id: crypto.randomUUID(),
      },
      {
        user_id: userId,
        event_type: 'document_action',
        event_data: { action: 'document_loaded', contentLength: 1500 },
        session_id: crypto.randomUUID(),
      },
      {
        user_id: userId,
        event_type: 'tool_usage',
        event_data: { tool: 'pomodoro_timer', duration: 1500 },
        session_id: crypto.randomUUID(),
      }
    ];

    // Insert sample events
    await supabase.from('user_analytics').insert(sampleEvents);

    // Generate AI insights based on the sample data
    const prompt = `Based on this user's learning behavior data, provide personalized recommendations:

User Profile: New user exploring productivity tools
Recent Activity:
- Completed a 25-minute Pomodoro session
- Created work-related tasks
- Loaded a document (1500 characters)
- Used the Pomodoro timer for 25 minutes

Provide specific, actionable recommendations to help them be more productive.

Respond in JSON format:
{
  "recommendations": [
    "Try shorter 15-minute focused sessions to build the habit gradually",
    "Use the task categorization feature to organize work vs personal tasks",
    "Take advantage of the document highlighting tools for better retention",
    "Set up break reminders to maintain energy throughout the day"
  ],
  "optimal_pomodoro_duration": 20,
  "optimal_break_duration": 5,
  "focus_peak_hours": [9, 10, 14, 15],
  "task_suggestions": [
    "Break large documents into smaller reading chunks",
    "Use color-coding for different types of tasks"
  ],
  "confidence": 0.75
}`;

    const aiResponse = await createOpenAICompletion([
      { role: 'system', content: 'You are an AI learning assistant that provides personalized productivity recommendations. Always respond with valid JSON.' },
      { role: 'user', content: prompt }
    ]);

    if (aiResponse) {
      try {
        const insightData = JSON.parse(aiResponse);
        
        // Store insights in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Expire in 7 days

        await supabase.from('ai_insights').insert([
          {
            user_id: userId,
            insight_type: 'recommendations',
            insight_data: { items: insightData.recommendations },
            confidence_score: insightData.confidence || 0.75,
            expires_at: expiresAt.toISOString()
          },
          {
            user_id: userId,
            insight_type: 'smart_defaults',
            insight_data: {
              pomodoro_duration: insightData.optimal_pomodoro_duration,
              break_duration: insightData.optimal_break_duration
            },
            confidence_score: insightData.confidence || 0.75,
            expires_at: expiresAt.toISOString()
          },
          {
            user_id: userId,
            insight_type: 'focus_patterns',
            insight_data: {
              peak_hours: insightData.focus_peak_hours,
              task_suggestions: insightData.task_suggestions
            },
            confidence_score: insightData.confidence || 0.75,
            expires_at: expiresAt.toISOString()
          }
        ]);

        return true;
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        return false;
      }
    }
  } catch (error) {
    console.error('Failed to generate demo insights:', error);
    return false;
  }
};