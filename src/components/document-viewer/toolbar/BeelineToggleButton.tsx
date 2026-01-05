import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import { useEditorContent } from "@/hooks/useEditorContent";
import { useToast } from "@/hooks/use-toast";

const BEELINE_COLORS = {
  start: "#006400", // Dark Green
  end: "#301934", // Dark Purple
};

// Apply beeline gradient to text nodes while preserving HTML structure
const applyBeelineToHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const processNode = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.trim()) {
        // Create a span with the gradient effect
        const span = doc.createElement('span');
        span.setAttribute('data-beeline', 'true');
        span.style.backgroundImage = `linear-gradient(90deg, ${BEELINE_COLORS.start}, ${BEELINE_COLORS.end})`;
        span.style.webkitBackgroundClip = 'text';
        span.style.backgroundClip = 'text';
        span.style.webkitTextFillColor = 'transparent';
        span.style.color = 'transparent';
        span.textContent = text;
        node.parentNode?.replaceChild(span, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      // Skip if already processed
      if (element.getAttribute('data-beeline') === 'true') {
        return;
      }
      // Process child nodes (create array to avoid live collection issues)
      Array.from(node.childNodes).forEach(child => processNode(child));
    }
  };
  
  processNode(doc.body);
  return doc.body.innerHTML;
};

// Remove beeline formatting from HTML
const removeBeelineFormatting = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const beelineSpans = doc.querySelectorAll('[data-beeline="true"]');
  beelineSpans.forEach(span => {
    const textNode = doc.createTextNode(span.textContent || '');
    span.parentNode?.replaceChild(textNode, span);
  });
  
  return doc.body.innerHTML;
};

export const BeelineToggleButton = () => {
  const { t } = useTranslation();
  const [isBeelineMode, setIsBeelineMode] = useState(false);
  const { content } = useEditorContent();
  const { toast } = useToast();

  const toggleBeelineMode = () => {
    const editor = content.editor;
    
    if (!editor) {
      toast({
        title: "Editor not available",
        description: "Please wait for the editor to load",
        variant: "destructive"
      });
      return;
    }

    const currentHTML = editor.getHTML();
    
    if (!isBeelineMode) {
      // Apply beeline formatting
      const beelineHTML = applyBeelineToHTML(currentHTML);
      editor.commands.setContent(beelineHTML);
      setIsBeelineMode(true);
      toast({
        title: "Beeline Reader enabled",
        description: "Color gradient applied to text"
      });
    } else {
      // Remove beeline formatting
      const cleanHTML = removeBeelineFormatting(currentHTML);
      editor.commands.setContent(cleanHTML);
      setIsBeelineMode(false);
      toast({
        title: "Beeline Reader disabled",
        description: "Color gradient removed"
      });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleBeelineMode}
          className={`h-9 w-9 relative bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            isBeelineMode ? 'bg-primary text-primary-foreground ring-2 ring-primary' : ''
          }`}
          aria-label={isBeelineMode ? 'Disable Beeline Reader' : 'Enable Beeline Reader'}
          aria-pressed={isBeelineMode}
        >
          <BookOpen className="h-4 w-4" />
          {isBeelineMode && (
            <div 
              className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
              role="status"
              aria-label="Beeline Reader active"
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom"
        className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
      >
        {isBeelineMode ? 'Disable Beeline Reader' : (t('tools.beeline') || 'Beeline Reader')}
      </TooltipContent>
    </Tooltip>
  );
};
