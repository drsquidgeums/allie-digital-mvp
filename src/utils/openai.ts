
import OpenAI from "openai";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { handleError } from '@/utils/errorHandling';

// Create an OpenAI client
export const createOpenAIClient = async () => {
  try {
    // Attempt to get the API key from Supabase, but handle the case where the table doesn't exist
    const { data, error } = await supabase
      .from('secrets')
      .select('secret')
      .eq('name', 'OPENAI_API_KEY')
      .single();

    if (error || !data?.secret) {
      console.error('OpenAI API key not found in Supabase');
      return null;
    }

    return new OpenAI({
      apiKey: data.secret,
      dangerouslyAllowBrowser: true
    });
  } catch (error) {
    handleError(error, {
      title: 'OpenAI Client Error', 
      fallbackMessage: 'Error initializing AI client',
      showToast: false
    });
    return null;
  }
};

// Function to create OpenAI API request with direct API key
export const createOpenAICompletion = async (messages) => {
  try {
    // Create client using key from Supabase if available
    const openai = await createOpenAIClient();
    
    if (!openai) {
      throw new Error("No valid OpenAI client available");
    }
    
    console.log("Attempting OpenAI API request with gpt-4o-mini model...");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the most cost-effective model
      messages: messages,
      max_tokens: 1024,
      temperature: 0.7,
    });
    
    console.log("OpenAI API request successful");
    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Check for specific error types
    const errorMessage = error?.toString() || "";
    const errorDetails = error?.error || {};
    
    if (errorDetails.type === "insufficient_quota" || errorMessage.includes("quota")) {
      return `I'm currently experiencing API quota limits. This happens when:

1. The API key has exceeded its usage limits
2. The billing information needs to be updated
3. The free tier limits have been reached

You can continue using my built-in knowledge base while this issue is being resolved. What would you like to know about using the learning tools?`;
    }
    
    if (errorMessage.includes("rate limit")) {
      return `I've hit a rate limit with my AI service. This is a temporary issue that occurs when:

1. Too many requests are made in a short time
2. The API has usage restrictions in place

Please try again in a minute, or ask me about using any of the learning tools in the meantime.`;
    }
    
    if (errorMessage.includes("authentication") || errorMessage.includes("invalid") || errorMessage.includes("key")) {
      return `There appears to be an issue with the AI service authentication:

1. The API key may be invalid or expired
2. The key might not have the correct permissions
3. The account associated with the key might need verification

In the meantime, I'll use my built-in knowledge to assist you with the ADHD learning application.`;
    }
    
    // Default fallback response
    return `I'm currently using my built-in knowledge to assist you. The AI service is unavailable, but I can still help with:

- Using the Pomodoro Timer for focused study
- Setting up Mind Mapping tools for visual organization
- Managing tasks with our point-based reward system
- Reading assistance with color overlays and the bionic reader
- Focus mode settings to reduce distractions
- PDF annotation and highlighting features

What would you like help with today?`;
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

// Tutor-specific system prompt
export const TUTOR_PROMPT = `You are an experienced tutor specializing in helping students with ADHD, dyslexia, and other learning differences. Your communication style is:

1. Encouraging and positive, focusing on strengths
2. Clear and concise with short paragraphs and bullet points
3. Specific with practical strategies tailored to learning differences

When answering questions:
- Suggest appropriate study techniques for students with attention challenges
- Recommend which accessibility tools in the application might help (Irlen overlays, bionic reader, etc.)
- Break down complex tasks into manageable steps
- Provide immediate, actionable advice

Remember to connect any advice to the app's features like the Pomodoro timer, mind mapping tool, or focus mode when relevant.`;

// Function to get tutor-specific response
export const createTutorResponse = async (question, tutorName, subject) => {
  const messages = [
    { 
      role: "system", 
      content: `${TUTOR_PROMPT}\n\nYou are ${tutorName}, a tutor specializing in ${subject}. Keep your responses conversational, helpful and focused on learning strategies.` 
    },
    { role: "user", content: question }
  ];
  
  return createOpenAICompletion(messages);
};
