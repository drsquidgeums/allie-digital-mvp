import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Square } from "lucide-react";

export const TextToSpeech = () => {
  const [text, setText] = React.useState("");
  const [voice, setVoice] = React.useState("1");
  const [isPlaying, setIsPlaying] = React.useState(false);
  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  React.useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis]);

  const handlePlay = () => {
    if (isPlaying) {
      speechSynthesis.pause();
    } else {
      if (utteranceRef.current) {
        speechSynthesis.resume();
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();
        utterance.voice = voices[parseInt(voice)];
        utteranceRef.current = utterance;
        
        utterance.onend = () => {
          setIsPlaying(false);
          utteranceRef.current = null;
        };
        
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

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Select value={voice} onValueChange={setVoice}>
          <SelectTrigger>
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Voice 1</SelectItem>
            <SelectItem value="2">Voice 2</SelectItem>
            <SelectItem value="3">Voice 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to read..."
        className="min-h-[200px]"
      />
      <div className="flex gap-2">
        <Button
          onClick={handlePlay}
          className="flex-1 bg-workspace-dark text-white hover:bg-workspace-dark/90"
        >
          {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button
          onClick={handleStop}
          variant="outline"
          className="flex-1"
        >
          <Square className="w-4 h-4 mr-2" />
          Stop
        </Button>
      </div>
    </div>
  );
};