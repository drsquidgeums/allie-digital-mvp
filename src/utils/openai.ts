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

export const SYSTEM_PROMPT = `You are a virtual assistant helping users navigate and use a web application. The application includes various features and tools. Provide clear, concise responses to help users understand and utilize the application effectively. Keep responses friendly and straightforward.`;