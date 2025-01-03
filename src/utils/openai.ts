import OpenAI from "openai";
import { supabase } from './supabase';

export const createOpenAIClient = async () => {
  const { data: { secret: apiKey }, error } = await supabase
    .from('secrets')
    .select('secret')
    .eq('name', 'OPENAI_API_KEY')
    .single();

  if (error || !apiKey) {
    throw new Error('OpenAI API key not found');
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const SYSTEM_PROMPT = `You are an ADHD Learning Assistant helping students use a digital workspace. The workspace includes:
- Pomodoro Timer for focused study
- Mind Mapping tool for visual learning
- Task Management system with points and rewards
- Reading tools (color overlays, bionic reader)
- Focus mode to reduce distractions

Provide short, clear responses focused on using these tools effectively for ADHD learners. Break information into small chunks and use bullet points when possible.`;