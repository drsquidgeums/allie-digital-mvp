
import OpenAI from "openai";
import { supabase } from './supabase';
import { toast } from "sonner";

// Create an OpenAI client
export const createOpenAIClient = async () => {
  try {
    const { data: { secret: apiKey }, error } = await supabase
      .from('secrets')
      .select('secret')
      .eq('name', 'OPENAI_API_KEY')
      .single();

    if (error || !apiKey) {
      console.error('OpenAI API key not found in Supabase');
      toast.error("OpenAI API key not found. Please add it in your Supabase database.");
      return null;
    }

    return new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  } catch (error) {
    console.error('Error creating OpenAI client:', error);
    toast.error("Error connecting to OpenAI. Check console for details.");
    return null;
  }
};

// Function to create OpenAI API request with direct API key
export const createOpenAICompletion = async (messages) => {
  try {
    // Use the project API key directly
    const OPENAI_API_KEY = "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";
    
    console.log("Attempting OpenAI API request...");
    
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 1024,
      temperature: 0.7,
    });
    
    console.log("OpenAI API request successful");
    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Improved fallback response with troubleshooting info
    return `I'm currently experiencing connection issues with my AI service. Here are some possible reasons:

1. Network connectivity issues: Check your internet connection
2. API key issues: The OpenAI API key may be expired or invalid
3. Rate limits: You may have hit OpenAI's rate limits
4. Service outage: OpenAI's service might be temporarily down

Meanwhile, I'll use my built-in knowledge to help you. What would you like to know about using this ADHD learning application?`;
  }
};

export const SYSTEM_PROMPT = `You are an ADHD Learning Assistant helping students use a digital workspace. The workspace includes:
- Pomodoro Timer for focused study sessions
- Mind Mapping tool for visual learning and organizing thoughts
- Task Management system with points and rewards for motivation
- Reading tools (color overlays, bionic reader) for easier reading
- Focus mode to reduce distractions and maintain concentration
- PDF document viewer with highlighting and annotation features

Provide clear, concise responses focused on helping ADHD learners use these tools effectively. Break information into small, manageable chunks and use bullet points when possible. Keep responses friendly and encouraging.

You should explain HOW to use the application's features when asked. For example, if asked about the Pomodoro timer, explain where to find it, how to start it, and how it can help with focus.`;
