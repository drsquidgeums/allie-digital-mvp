import React, { useCallback } from 'react';
import { AudioLines, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEditorContent } from '@/hooks/useEditorContent';
import { useInlineDictation } from '@/hooks/useInlineDictation';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useElevenLabsBYOKPrompt } from '@/hooks/useElevenLabsBYOKPrompt';
import { ElevenLabsBYOKPrompt } from '@/components/byok/ElevenLabsBYOKPrompt';

export const STTToggleButton: React.FC = () => {
  const { t } = useTranslation();
  const { content } = useEditorContent();
  const editor = content?.editor ?? null;

  const insertTextAtCursor = useCallback(
    (text: string) => {
      const cleanText = text.trim();
      if (!editor || !cleanText) return;

      editor
        .chain()
        .focus()
        .insertContent({ type: 'text', text: `${cleanText} ` })
        .run();
    },
    [editor]
  );

  const { showPrompt, triggerPrompt, dismissPrompt } = useElevenLabsBYOKPrompt();

  const { isListening, isSupported, startListening, stopListening } = useInlineDictation({
    editor,
    insertText: insertTextAtCursor,
  });

  const toggle = useCallback(() => {
    if (isListening) {
      stopListening();
      toast.success('Dictation stopped');
    } else {
      triggerPrompt();
      void startListening().then((mode) => {
        if (mode === 'elevenlabs') {
          toast.success('Dictation started – pause briefly and text will appear in the editor');
        } else if (mode === 'browser') {
          toast.success('Dictation started – speak now, text goes into editor');
        }
      });
    }
  }, [isListening, startListening, stopListening]);

  if (!isSupported) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={toggle}
          className={`h-9 w-9 relative bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            isListening
              ? 'bg-destructive text-destructive-foreground ring-2 ring-destructive'
              : ''
          }`}
          aria-label={isListening ? 'Stop Dictation' : t('tools.stt')}
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <AudioLines className="h-4 w-4" />
          )}
          {isListening && (
            <div
              className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse"
              role="status"
              aria-label="Dictation active"
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="bg-popover text-popover-foreground px-3 py-1.5 text-sm"
      >
        {isListening ? 'Stop Dictation (recording...)' : t('tools.stt')}
      </TooltipContent>
    </Tooltip>
  );
};
