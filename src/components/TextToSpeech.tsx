
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { notifyAICreditsUsed } from "@/utils/aiCreditsEvent";
import { handleAIUsageLimitError } from "@/utils/aiUsageLimitHandler";
import { Play, Pause, Square, Volume2, Sparkles } from "lucide-react";
import { usePersistedText } from "@/hooks/usePersistedText";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ELEVENLABS_VOICES = [
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah - Warm & Clear" },
  { id: "9BWtsMINqrJLrRacOk9x", name: "Aria - Professional" },
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger - Deep & Authoritative" },
  { id: "FGY2WhTYpPnrIDTdsKH5", name: "Laura - Friendly" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam - British" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte - Energetic" },
];

export const TextToSpeech = () => {
  const [text, setText] = usePersistedText("tts");
  const [selectedVoice, setSelectedVoice] = React.useState("");
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isSupported, setIsSupported] = React.useState(false);
  const [useElevenLabs, setUseElevenLabs] = React.useState(true);
  const [isLoadingEL, setIsLoadingEL] = React.useState(false);
  const [selectedELVoice, setSelectedELVoice] = React.useState(ELEVENLABS_VOICES[0].id);
  const [audioElement, setAudioElement] = React.useState<HTMLAudioElement | null>(null);
  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    // Check if speech synthesis is supported
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);
    
    if (!supported) {
      console.log('Speech synthesis not supported');
      return;
    }

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      console.log('Available voices:', availableVoices.length);
      
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

  const handlePlayElevenLabs = async () => {
    if (!text.trim()) {
      toast({
        title: "No text",
        description: "Please enter some text to read",
        variant: "destructive"
      });
      return;
    }

    if (isPlaying && audioElement) {
      audioElement.pause();
      setIsPlaying(false);
      return;
    }

    if (audioElement && audioElement.paused) {
      audioElement.play();
      setIsPlaying(true);
      return;
    }

    setIsLoadingEL(true);

    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { text, voiceId: selectedELVoice }
      });

      if (error) {
        throw new Error(error.message || "Failed to generate speech");
      }

      if (!data?.audioContent) {
        throw new Error("No audio data received");
      }

      // Convert base64 to audio blob
      notifyAICreditsUsed();
      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsPlaying(false);
        setAudioElement(null);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        setAudioElement(null);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "Playback Error",
          description: "Failed to play audio",
          variant: "destructive"
        });
      };

      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);

      toast({
        title: "Playing",
        description: "ElevenLabs text-to-speech started"
      });
    } catch (error) {
      console.error("ElevenLabs TTS error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate speech",
        variant: "destructive"
      });
    } finally {
      setIsLoadingEL(false);
    }
  };

  const handlePlay = () => {
    if (useElevenLabs) {
      handlePlayElevenLabs();
      return;
    }

    if (!isSupported) {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser",
        variant: "destructive"
      });
      return;
    }

    if (!text.trim()) {
      toast({
        title: "No text",
        description: "Please enter some text to read",
        variant: "destructive"
      });
      return;
    }

    if (isPlaying) {
      speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (utteranceRef.current && speechSynthesis.paused) {
        speechSynthesis.resume();
        setIsPlaying(true);
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

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsPlaying(false);
          utteranceRef.current = null;
          toast({
            title: "Speech Error",
            description: "There was an error with text-to-speech",
            variant: "destructive"
          });
        };
        
        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
        setIsPlaying(true);
        
        toast({
          title: "Playing",
          description: "Text-to-speech started"
        });
      }
    }
  };

  const handleStop = () => {
    if (useElevenLabs && audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
      setAudioElement(null);
    } else {
      speechSynthesis.cancel();
      setIsPlaying(false);
      utteranceRef.current = null;
    }
    toast({
      title: "Stopped",
      description: "Text-to-speech stopped"
    });
  };

  if (!isSupported) {
    return (
      <div className="p-4 space-y-4 animate-fade-in">
        <div className="text-center text-muted-foreground">
          <Volume2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Text-to-speech is not supported in your browser.</p>
          <p className="text-sm">Try using a different browser.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between space-x-2 pb-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <Label htmlFor="use-elevenlabs">Use ElevenLabs AI</Label>
        </div>
        <Switch
          id="use-elevenlabs"
          checked={useElevenLabs}
          onCheckedChange={setUseElevenLabs}
        />
      </div>

      {useElevenLabs ? (
        <div className="space-y-2">
          <Label>AI Voice</Label>
          <Select value={selectedELVoice} onValueChange={setSelectedELVoice}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ELEVENLABS_VOICES.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Browser Voice</Label>
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
      )}
      
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
          disabled={isLoadingEL}
        >
          {isLoadingEL ? (
            <>Loading...</>
          ) : (
            <>
              {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
              {isPlaying ? "Pause" : "Play"}
            </>
          )}
        </Button>
        <Button
          onClick={handleStop}
          size="sm"
          variant="outline"
          className="flex-1 h-8 text-xs"
          disabled={isLoadingEL}
        >
          <Square className="w-3 h-3 mr-1" />
          Stop
        </Button>
      </div>
    </div>
  );
};
