
import OpenAI from "openai";
import { supabase } from './supabase';
import { toast } from "sonner";

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

export const SYSTEM_PROMPT = `You are an ADHD Learning Assistant helping students use a digital workspace. The workspace includes:
- Pomodoro Timer for focused study sessions
- Mind Mapping tool for visual learning and organizing thoughts
- Task Management system with points and rewards for motivation
- Reading tools (color overlays, bionic reader) for easier reading
- Focus mode to reduce distractions and maintain concentration
- PDF document viewer with highlighting and annotation features

Provide clear, concise responses focused on helping ADHD learners use these tools effectively. Break information into small, manageable chunks and use bullet points when possible. Keep responses friendly and encouraging.

You should explain HOW to use the application's features when asked. For example, if asked about the Pomodoro timer, explain where to find it, how to start it, and how it can help with focus.`;
