
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Square, ArrowDownToLine } from "lucide-react";
import { usePersistedText } from "@/hooks/usePersistedText";
import { useToast } from "@/hooks/use-toast";
import { useEditorContent } from "@/hooks/useEditorContent";

export const TextToSpeech = () => {
  const [text, setText] = usePersistedText("tts");
  const [selectedVoice, setSelectedVoice] = React.useState("");
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();
  const { content, getSelectedText } = useEditorContent();

  React.useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      // Filter for English voices only
      const englishVoices = availableVoices.filter(voice => 
        voice.lang.includes('en')
      );
      setVoices(englishVoices);
      
      // Set default voice if none selected
      if (!selectedVoice && englishVoices.length > 0) {
        setSelectedVoice(englishVoices[0].voiceURI);
      }
    };

    loadVoices();
    
    // Some browsers need this event to load voices
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  // Get text from editor when content changes
  useEffect(() => {
    if (content.text && !text) {
      setText(content.text);
    }
  }, [content.text]);

  const getVoiceLabel = (voice: SpeechSynthesisVoice) => {
    const lang = voice.lang.toLowerCase();
    if (lang.includes('gb')) return `UK English (${voice.name})`;
    if (lang.includes('us')) return `US English (${voice.name})`;
    if (lang.includes('au')) return `Australian English (${voice.name})`;
    if (lang.includes('ie')) return `Irish English (${voice.name})`;
    if (lang.includes('za')) return `South African English (${voice.name})`;
    if (lang.includes('nz')) return `New Zealand English (${voice.name})`;
    if (lang.includes('in')) return `Indian English (${voice.name})`;
    if (lang.includes('ca')) return `Canadian English (${voice.name})`;
    return `English (${voice.name})`;
  };

  const handlePlay = () => {
    if (isPlaying) {
      speechSynthesis.pause();
    } else {
      if (utteranceRef.current) {
        speechSynthesis.resume();
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoiceObj = voices.find(v => v.voiceURI === selectedVoice);
        if (selectedVoiceObj) {
          utterance.voice = selectedVoiceObj;
        }
        
        utterance.onend = () => {
          setIsPlaying(false);
          utteranceRef.current = null;
        };
        
        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    utteranceRef.current = null;
  };

  // Get text from editor
  const handleGetFromEditor = () => {
    const selectedText = getSelectedText();
    
    if (selectedText) {
      setText(selectedText);
      toast({
        title: "Text selected",
        description: "Selected text imported from editor"
      });
    } else if (content.text) {
      setText(content.text);
      toast({
        title: "Text imported",
        description: "Full document text imported from editor"
      });
    }
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Select value={selectedVoice} onValueChange={setSelectedVoice}>
          <SelectTrigger>
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((voice) => (
              <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                {getVoiceLabel(voice)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        size="sm" 
        variant="outline" 
        className="w-full text-xs"
        onClick={handleGetFromEditor}
      >
        <ArrowDownToLine className="w-3 h-3 mr-1" />
        Get Text from Editor
      </Button>
      
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to read..."
        className="min-h-[200px]"
      />
      <div className="flex gap-2">
        <Button
          onClick={handlePlay}
          size="sm"
          variant="outline"
          className="flex-1 h-8 text-xs"
        >
          {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button
          onClick={handleStop}
          size="sm"
          variant="outline"
          className="flex-1 h-8 text-xs"
        >
          <Square className="w-3 h-3 mr-1" />
          Stop
        </Button>
      </div>
    </div>
  );
};
