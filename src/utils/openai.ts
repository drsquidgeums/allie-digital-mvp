
import OpenAI from "openai";
import { supabase } from '@/integrations/supabase/client';

// Create an OpenAI client
export const createOpenAIClient = async () => {
  try {
    console.log("Creating OpenAI client...");
    
    // Try to get the API key from Supabase secrets
    const { data, error } = await supabase
      .from('secrets')
      .select('secret')
      .eq('name', 'OPENAI_API_KEY')
      .maybeSingle();

    console.log("Supabase secrets query result:", { data, error });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to retrieve API key: ${error.message}`);
    }

    if (!data?.secret) {
      console.log('No OpenAI API key found in database - checking all secrets...');
      
      // Let's check what secrets are actually available
      const { data: allSecrets, error: allSecretsError } = await supabase
        .from('secrets')
        .select('name, secret');
        
      console.log('All available secrets:', allSecrets);
      console.log('All secrets error:', allSecretsError);
      
      throw new Error('OpenAI API key not configured. Please add your API key to continue.');
    }

    console.log("OpenAI API key found, creating client...");
    
    const client = new OpenAI({
      apiKey: data.secret,
      dangerouslyAllowBrowser: true
    });

    return client;
  } catch (error) {
    console.error('Failed to create OpenAI client:', error);
    throw error;
  }
};

// Function to create OpenAI completion
export const createOpenAICompletion = async (messages: any[]) => {
  try {
    console.log("Starting OpenAI completion request...");
    console.log("Messages being sent:", JSON.stringify(messages, null, 2));
    
    const openai = await createOpenAIClient();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });
    
    console.log("Raw OpenAI response:", response);
    
    const content = response.choices[0]?.message?.content;
    console.log("Extracted content:", content);
    
    if (!content) {
      console.error("No content in OpenAI response");
      return null;
    }
    
    return content;
  } catch (error) {
    console.error("OpenAI completion failed:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
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
