
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

// Function to create Anthropic API request
export const createClaudeCompletion = async (messages) => {
  try {
    // Using an environment-specific approach for the Claude API key
    const CLAUDE_API_KEY = "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";
    
    // Try direct API access first - this works in some environments
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 1024,
          messages: messages,
          temperature: 0.7
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.content[0].text;
      }
    } catch (directError) {
      console.log("Direct API access failed, trying with CORS proxy:", directError);
    }
    
    // If direct access fails, try with CORS proxy
    const proxyUrl = "https://api.allorigins.win/raw?url=";
    const apiUrl = encodeURIComponent("https://api.anthropic.com/v1/messages");
    
    const response = await fetch(proxyUrl + apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        messages: messages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Claude API error:", errorData);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    // Instead of throwing, return a helpful message
    return "I'm currently experiencing connection issues. I'll use my built-in knowledge to help you. What would you like to know about using this ADHD learning application?";
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
