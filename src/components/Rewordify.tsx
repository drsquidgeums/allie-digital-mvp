import React, { useRef, useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useEditorContent } from "@/hooks/useEditorContent";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifyAICreditsUsed } from "@/utils/aiCreditsEvent";
import { handleAIUsageLimitError } from "@/utils/aiUsageLimitHandler";

export const Rewordify = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const { content, getSelectedText, setEditorText } = useEditorContent();
  const { toast } = useToast();

  const handleSimplify = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text",
        description: "Please enter some text to simplify",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setOutputText("");

    try {
      const { data, error } = await supabase.functions.invoke('simplify-text', {
        body: { text: inputText }
      });

      if (error) {
        const errMsg = error.message || "Failed to simplify text";
        if (handleAIUsageLimitError(error)) return;
        throw new Error(errMsg);
      }

      if (data?.simplifiedText) {
        setOutputText(data.simplifiedText);
        notifyAICreditsUsed();
        toast({
          title: "Text simplified",
          description: "Your text has been made easier to read"
        });
      }
    } catch (error) {
      console.error("Simplify error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to simplify text",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get text from editor
  const handleGetFromEditor = () => {
    const selectedText = getSelectedText();
    
    if (selectedText) {
      setInputText(selectedText);
      toast({
        title: "Text selected",
        description: "Selected text imported from editor"
      });
    } else if (content.text) {
      setInputText(content.text);
      toast({
        title: "Text imported",
        description: "Full document text imported from editor"
      });
    }
  };

  // Send simplified text to editor
  const handleSendToEditor = () => {
    if (outputText) {
      setEditorText(outputText);
      toast({
        title: "Text applied",
        description: "Simplified text has been sent to the editor"
      });
    }
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <Wand2 className="w-4 h-4" />
        <h3 className="font-medium">AI Text Simplifier</h3>
      </div>
      
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs flex-1"
          onClick={handleGetFromEditor}
        >
          Get from Editor
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs flex-1"
          onClick={handleSendToEditor}
          disabled={!outputText}
        >
          Send to Editor
        </Button>
      </div>
      
      <Textarea
        placeholder="Paste or type complex text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full min-h-[80px] resize-none"
        rows={3}
      />

      <Button 
        onClick={handleSimplify}
        disabled={isLoading || !inputText.trim()}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Simplifying...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            Simplify Text
          </>
        )}
      </Button>
      
      {outputText && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Simplified Text:
          </label>
          <div 
            ref={outputRef}
            className="border-2 border-primary/30 bg-primary/5 p-4 rounded-lg min-h-[80px] text-left"
          >
            <div className="leading-relaxed text-base whitespace-pre-wrap">
              {outputText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
