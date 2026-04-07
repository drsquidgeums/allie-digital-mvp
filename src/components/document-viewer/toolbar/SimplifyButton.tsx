import { Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import { useEditorContent } from "@/hooks/useEditorContent";
import { notifyAICreditsUsed } from "@/utils/aiCreditsEvent";
import { handleAIUsageLimitError } from "@/utils/aiUsageLimitHandler";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const SimplifyButton = () => {
  const { t } = useTranslation();
  const { content, getSelectedText } = useEditorContent();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    const editor = content.editor;
    if (!editor) return;

    const selectedText = getSelectedText();

    if (!selectedText || !selectedText.trim()) {
      toast({
        title: "No text selected",
        description: "Please highlight some text in the editor to simplify",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("simplify-text", {
        body: { text: selectedText },
      });

      if (error) {
        if (handleAIUsageLimitError(error)) return;
        throw new Error(error.message || "Failed to simplify text");
      }

      if (data?.simplifiedText) {
        notifyAICreditsUsed();

        // Replace the selected text with the simplified version wrapped in a highlight
        editor
          .chain()
          .focus()
          .deleteSelection()
          .insertContent({
            type: "text",
            text: data.simplifiedText,
            marks: [
              {
                type: "highlight",
                attrs: { color: "#FFFF00" },
              },
            ],
          })
          .run();

        toast({
          title: "Text simplified",
          description: "Highlighted text has been replaced with a simpler version",
        });
      }
    } catch (error) {
      console.error("Simplify error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to simplify text",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={isLoading}
          className="h-9 w-9 relative bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={t("tools.rewordify") || "Simplify Text"}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="bg-popover text-popover-foreground px-3 py-2 text-sm max-w-48 text-center"
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">
            {t("tools.rewordify") || "AI Simplify"}
          </span>
          <span className="text-xs text-muted-foreground">
            Highlight text first
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};