import React, { useState, useRef, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEditorContent } from '@/hooks/useEditorContent';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const STTToggleButton: React.FC = () => {
  const { t } = useTranslation();
  const { content } = useEditorContent();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef('');

  const isSupported =
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const insertTextAtCursor = useCallback(
    (text: string) => {
      const editor = content.editor;
      if (!editor || !text) return;

      editor.chain().focus().insertContent(text).run();
    },
    [content.editor]
  );

  const startListening = useCallback(() => {
    if (!isSupported) {
      toast.error('Speech recognition is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    const editor = content.editor;
    if (!editor) {
      toast.error('No editor available');
      return;
    }

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = navigator.language || 'en-US';

      finalTranscriptRef.current = '';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const text = event.results[i][0].transcript;
            insertTextAtCursor(text);
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);

        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied – please allow microphone permission');
        } else if (event.error !== 'aborted') {
          toast.error(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
      toast.success('Dictation started – speak now, text goes into editor');
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      toast.error('Failed to start speech recognition');
    }
  }, [isSupported, content.editor, insertTextAtCursor]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
      toast.success('Dictation stopped');
    }
  }, []);

  const toggle = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
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
            <Mic className="h-4 w-4" />
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
        {isListening ? 'Stop Dictation' : t('tools.stt')}
      </TooltipContent>
    </Tooltip>
  );
};
