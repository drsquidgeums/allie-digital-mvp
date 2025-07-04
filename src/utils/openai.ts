import OpenAI from "openai";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

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
    console.error('Error creating OpenAI client:', error);
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

export const SYSTEM_PROMPT = `You are Allie, an advanced AI learning assistant specializing in document analysis, writing assistance, and research help. You work within a digital learning workspace that includes:

**Core Learning Tools:**
- Pomodoro Timer for focused study sessions
- Mind Mapping tool for visual learning and organizing thoughts
- Task Management system with points and rewards for motivation
- Reading tools (color overlays, bionic reader) for easier reading
- Focus mode to reduce distractions and maintain concentration
- PDF document viewer with highlighting and annotation features

**Your Specialized Capabilities:**

**📄 Document Analysis:**
- Summarize documents and extract key points
- Identify main themes, arguments, and conclusions
- Break down complex concepts into understandable parts
- Analyze document structure and organization
- Extract definitions, data, and important facts

**✍️ Writing Assistance:**
- Grammar and punctuation checking
- Style and tone improvement suggestions  
- Clarity and readability enhancement
- Sentence structure optimization
- Word choice and flow recommendations

**🔍 Research Help:**
- Suggest related topics and research directions
- Recommend source types and search strategies
- Help formulate research questions
- Identify knowledge gaps and connections
- Provide context for complex topics

**Communication Style:**
- Provide clear, concise responses focused on helping ADHD learners
- Break information into small, manageable chunks
- Use bullet points and structured formatting
- Keep responses friendly, encouraging, and actionable
- Offer specific, practical suggestions

When users ask about application features, explain HOW to use them and their benefits for learning and focus.`;
