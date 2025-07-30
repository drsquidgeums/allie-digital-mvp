import { supabase } from '@/integrations/supabase/client';

/**
 * Creates an Anthropic client with API key from Supabase secrets
 */
export const createAnthropicClient = async () => {
  try {
    console.log("Creating Anthropic client...");
    
    // Try to get the API key from Supabase secrets
    const { data, error } = await supabase
      .from('secrets')
      .select('secret')
      .eq('name', 'ANTHROPIC_API_KEY')
      .maybeSingle();

    console.log("Supabase secrets query result:", { data, error });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to retrieve API key: ${error.message}`);
    }

    if (!data?.secret) {
      console.log('No Anthropic API key found in database');
      throw new Error('Anthropic API key not configured. Please add your API key to continue.');
    }

    console.log("Anthropic API key found, returning client config...");
    
    return {
      apiKey: data.secret,
      baseURL: 'https://api.anthropic.com'
    };
  } catch (error) {
    console.error('Failed to create Anthropic client:', error);
    throw error;
  }
};

/**
 * Creates a completion using Anthropic Claude
 */
export const createAnthropicCompletion = async (messages: any[]): Promise<string | null> => {
  try {
    console.log("Starting Anthropic completion request...");
    console.log("Messages being sent:", JSON.stringify(messages, null, 2));
    
    const client = await createAnthropicClient();
    
    // Convert OpenAI-style messages to Anthropic format
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');
    
    const requestBody = {
      model: 'claude-sonnet-4-20250514', // Upgraded to Claude 4 for better reasoning
      max_tokens: 4000, // Increased for more detailed insights
      system: systemMessage?.content || SYSTEM_PROMPT,
      messages: userMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    };

    console.log("Anthropic request body:", JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${client.apiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    console.log("Anthropic response status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', response.status, errorData);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Anthropic response received:', data);
    
    const content = data.content?.[0]?.text;
    console.log("Extracted content:", content);
    
    if (!content) {
      console.error("No content in Anthropic response");
      return null;
    }
    
    return content;
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return null;
  }
};

/**
 * System prompt for the AI assistant
 */
export const SYSTEM_PROMPT = `You are an AI productivity assistant integrated into a comprehensive workspace application. Your role is to analyze user behavior patterns and provide personalized recommendations to enhance productivity and well-being.

CAPABILITIES:
- Analyze usage patterns across tools (Pomodoro timer, task manager, document editor, PDF viewer, mind maps)
- Identify productivity trends and potential improvement areas
- Suggest optimal work/break cycles based on user behavior
- Recommend workflow optimizations
- Provide insights on focus patterns and attention management

ANALYSIS FOCUS:
- Tool usage frequency and duration
- Peak productivity hours and patterns
- Break timing and effectiveness
- Task completion rates and workflows
- Document interaction patterns

RESPONSE FORMAT:
Always respond with valid JSON containing:
{
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "optimal_pomodoro_duration": 25,
  "optimal_break_duration": 5,
  "focus_peak_hours": [9, 10, 14, 15],
  "task_suggestions": ["suggestion1", "suggestion2"],
  "confidence": 0.8
}

COMMUNICATION STYLE:
- Be concise and actionable
- Focus on measurable improvements
- Provide specific, implementable suggestions
- Use encouraging and supportive language
- Base recommendations on actual usage data when available`;

// Legacy function name for backward compatibility
export const createOpenAICompletion = createAnthropicCompletion;