import React from "react";
import { Button } from "./ui/button";
import { Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const MUSIC_OPTIONS = [
  {
    id: "classical",
    name: "Classical Piano",
    url: "https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3",
  },
  {
    id: "ambient",
    name: "Ambient Nature",
    url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_1fb4c56a6d.mp3",
  },
  {
    id: "electronic",
    name: "Minimal Electronic",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1a42.mp3",
  },
];

export const AmbientMusic = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [selectedMusic, setSelectedMusic] = React.useState<string>("");
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleMusicChange = (value: string) => {
    const music = MUSIC_OPTIONS.find((opt) => opt.id === value);
    if (!music || !audioRef.current) return;

    audioRef.current.src = music.url;
    setSelectedMusic(value);
    
    if (isPlaying) {
      audioRef.current.play();
      toast({
        title: "Music changed",
        description: `Now playing: ${music.name}`,
      });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !selectedMusic) {
      toast({
        title: "Please select a music option",
        description: "Choose from the available music options to play",
      });
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      toast({
        title: "Music paused",
        description: "Background music has been paused",
      });
    } else {
      audioRef.current.play().catch(() => {
        toast({
          title: "Playback failed",
          description: "Unable to play the selected music",
          variant: "destructive",
        });
      });
      toast({
        title: "Music playing",
        description: `Now playing: ${MUSIC_OPTIONS.find(opt => opt.id === selectedMusic)?.name}`,
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-9 w-9 bg-background hover:bg-accent hover:text-accent-foreground ${
            isPlaying ? "text-primary" : ""
          }`}
          title="Ambient Music"
        >
          <Music className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-popover text-popover-foreground border-border" align="end">
        <div className="space-y-4">
          <div className="font-medium text-sm">Ambient Music</div>
          <RadioGroup
            value={selectedMusic}
            onValueChange={handleMusicChange}
            className="space-y-2"
          >
            {MUSIC_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id}>{option.name}</Label>
              </div>
            ))}
          </RadioGroup>
          <Button
            onClick={togglePlay}
            className="w-full"
            variant={isPlaying ? "destructive" : "default"}
          >
            {isPlaying ? "Stop Music" : "Play Music"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};