
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
    // For development, we'll use the stored API key
    // In production, this should be retrieved from Supabase secrets
    const CLAUDE_API_KEY = "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";
    
    // Set request options and headers
    const options = {
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
    };
    
    // Log the API request attempt
    console.log("Attempting Claude API request...");
    
    // First try - direct API access
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", options);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Claude API direct access successful");
        return data.content[0].text;
      } else {
        const errorText = await response.text();
        console.error("Claude API error response:", errorText);
        throw new Error(`Claude API error: ${response.status}`);
      }
    } catch (directError) {
      console.error("Direct API access failed:", directError);
      console.log("Trying alternative approaches...");
      
      // Second try - with a reliable CORS proxy
      try {
        // Using a different CORS proxy as allorigins might be unreliable
        const corsProxyUrl = "https://corsproxy.io/?";
        const apiUrl = encodeURIComponent("https://api.anthropic.com/v1/messages");
        
        const proxyResponse = await fetch(corsProxyUrl + apiUrl, options);
        
        if (proxyResponse.ok) {
          const data = await proxyResponse.json();
          console.log("Claude API proxy access successful");
          return data.content[0].text;
        } else {
          const errorText = await proxyResponse.text();
          console.error("Claude API proxy error:", errorText);
          throw new Error(`Claude API proxy error: ${proxyResponse.status}`);
        }
      } catch (proxyError) {
        console.error("CORS proxy attempt failed:", proxyError);
        throw proxyError; // Let the main catch block handle this
      }
    }
  } catch (error) {
    console.error("All Claude API connection attempts failed:", error);
    
    // Improved fallback response with troubleshooting info
    return `I'm currently experiencing connection issues with my AI service. Here are some possible reasons:

1. Network connectivity issues: Check your internet connection
2. API key issues: The Claude API key may be expired or invalid
3. CORS restrictions: Browser security is preventing the API call
4. Service outage: Claude API service might be temporarily down

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

