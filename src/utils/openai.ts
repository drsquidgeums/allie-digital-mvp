
import OpenAI from "openai";
import { supabase } from '@/integrations/supabase/client';

// Create an OpenAI client
export const createOpenAIClient = async () => {
  try {
    console.log("=== ATTEMPTING TO CREATE OPENAI CLIENT ===");
    
    const { data, error } = await supabase
      .from('secrets')
      .select('secret')
      .eq('name', 'OPENAI_API_KEY')
      .maybeSingle();

    console.log("Supabase secrets query result:", { data, error });

    if (error) {
      console.error('Error fetching OpenAI API key from Supabase:', error);
      return null;
    }

    if (!data?.secret) {
      console.log('OpenAI API key not found in Supabase secrets table');
      return null;
    }

    console.log("OpenAI API key found, creating client...");
    
    const client = new OpenAI({
      apiKey: data.secret,
      dangerouslyAllowBrowser: true
    });

    console.log("OpenAI client created successfully");
    return client;
  } catch (error) {
    console.error('Error creating OpenAI client:', error);
    return null;
  }
};

// Function to create OpenAI API request
export const createOpenAICompletion = async (messages: any[]) => {
  try {
    console.log("=== CREATING OPENAI COMPLETION ===");
    const openai = await createOpenAIClient();
    
    if (!openai) {
      console.log("No OpenAI client available - throwing error");
      throw new Error("No OpenAI client available");
    }
    
    console.log("Making OpenAI API request with messages:", messages.length);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 1024,
      temperature: 0.7,
    });
    
    console.log("OpenAI API response received:", response);
    console.log("Response content:", response.choices[0].message.content);
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API call failed with error:", error);
    throw error;
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
