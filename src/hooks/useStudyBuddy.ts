import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { notifyAICreditsUsed } from "@/utils/aiCreditsEvent";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface StudyBuddyContext {
  currentDocument?: {
    name: string;
    content: string;
  };
  recentTasks?: string[];
  currentTime?: string;
}

export const useStudyBuddy = (context?: StudyBuddyContext) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! I'm Allie, your AI study buddy 👋\n\nI'm here to help you:\n• Break down overwhelming tasks\n• Explain tricky concepts\n• Create study plans\n• Stay on track\n\nWhat are you working on today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const newUserMessage: Message = { role: "user", content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/study-buddy-chat`;

      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map(m => ({ role: m.role, content: m.content })),
          context: {
            ...context,
            currentTime: new Date().toISOString()
          }
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.code === "USAGE_LIMIT_REACHED" || errorData.error?.includes("Monthly AI credits")) {
          setMessages(prev => [
            ...prev,
            {
              role: "assistant",
              content: "⚠️ Your monthly AI credits have been used up. You can add your own OpenAI API key in **Settings → AI Settings** for unlimited access, or wait until credits reset on the 1st of next month."
            }
          ]);
          setIsLoading(false);
          return;
        }
        throw new Error(errorData.error || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let textBuffer = "";

      // Add empty assistant message that we'll update
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantMessage
                };
                return newMessages;
              });
            }
          } catch (e) {
            // Incomplete JSON, put it back
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Process any remaining buffer
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw || raw.startsWith(":") || !raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantMessage
                };
                return newMessages;
              });
            }
          } catch { /* ignore */ }
        }
      }

      notifyAICreditsUsed();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }
      
      console.error("Study Buddy error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! I had trouble processing that. Could you try asking again? 🤔"
        }
      ]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, context]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        role: "assistant",
        content: "Hey! I'm Allie, your AI study buddy 👋\n\nI'm here to help you:\n• Break down overwhelming tasks\n• Explain tricky concepts\n• Create study plans\n• Stay on track\n\nWhat are you working on today?"
      }
    ]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
};
