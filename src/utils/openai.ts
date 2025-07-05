
import OpenAI from "openai";
import { supabase } from '@/integrations/supabase/client';

// Create an OpenAI client
export const createOpenAIClient = async () => {
  try {
    console.log("=== OPENAI UTILS: Creating OpenAI client ===");
    
    const { data, error } = await supabase
      .from('secrets')
      .select('secret')
      .eq('name', 'OPENAI_API_KEY')
      .maybeSingle();

    console.log("=== OPENAI UTILS: Supabase query result ===");
    console.log("Data:", data);
    console.log("Error:", error);

    if (error) {
      console.error('=== OPENAI UTILS: Supabase error ===', error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data?.secret) {
      console.log('=== OPENAI UTILS: No API key found ===');
      throw new Error('OpenAI API key not found in Supabase secrets. Please add your OpenAI API key to the secrets table.');
    }

    console.log("=== OPENAI UTILS: API key found, creating client ===");
    
    const client = new OpenAI({
      apiKey: data.secret,
      dangerouslyAllowBrowser: true
    });

    console.log("=== OPENAI UTILS: Client created successfully ===");
    return client;
  } catch (error) {
    console.error('=== OPENAI UTILS: Client creation failed ===', error);
    throw error;
  }
};

// Function to create OpenAI API request
export const createOpenAICompletion = async (messages: any[]) => {
  try {
    console.log("=== OPENAI UTILS: Starting completion request ===");
    console.log("Messages count:", messages.length);
    
    const openai = await createOpenAIClient();
    
    console.log("=== OPENAI UTILS: Making API call ===");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 1024,
      temperature: 0.7,
    });
    
    console.log("=== OPENAI UTILS: API response received ===");
    console.log("Response structure:", {
      choices_length: response.choices?.length,
      first_choice_message: response.choices?.[0]?.message?.content ? "Present" : "Missing"
    });
    
    const content = response.choices[0]?.message?.content;
    console.log("=== OPENAI UTILS: Extracted content ===");
    console.log("Content type:", typeof content);
    console.log("Content length:", content?.length);
    
    return content;
  } catch (error) {
    console.error("=== OPENAI UTILS: Completion failed ===");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error instanceof Error ? error.message : 'Unknown error');
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
