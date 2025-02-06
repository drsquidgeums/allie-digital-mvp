export interface MusicOption {
  id: string;
  name: string;
  url: string;
}

export const MUSIC_OPTIONS: MusicOption[] = [
  {
    id: "classic",
    name: "Classic FM",
    url: "https://media-ssl.musicradio.com/ClassicFM",
  },
  {
    id: "chillout",
    name: "Chillout",
    url: "https://radio.stereoscenic.com/asm-h", // Ambient Sleeping Pill radio
  },
  {
    id: "minimal",
    name: "Minimal",
    url: "https://ice1.somafm.com/groovesalad-128-mp3", // SomaFM Groove Salad
  },
  {
    id: "alpha-waves",
    name: "Alpha Waves Focus",
    url: "https://radio.stereoscenic.com/asp-h", // Alpha wave binaural beats
  },
  {
    id: "study-beats",
    name: "Lo-Fi Study",
    url: "https://radio.stereoscenic.com/asm-h", // Ambient Sleeping Pill
  },
  {
    id: "nature-ambient",
    name: "Nature Sounds",
    url: "https://radio.stereoscenic.com/nat-h", // Nature ambient
  },
  {
    id: "deep-focus",
    name: "Deep Focus",
    url: "https://ice1.somafm.com/dronezone-128-mp3", // SomaFM Drone Zone
  },
  {
    id: "space-ambient",
    name: "Space Dreams",
    url: "https://ice1.somafm.com/mission-control-128-mp3", // SomaFM Mission Control - space-themed ambient
  },
  {
    id: "minimal-piano",
    name: "Minimal Beats",
    url: "https://ice1.somafm.com/deepspaceone-128-mp3", // SomaFM Deep Space One - ambient piano
  },
  {
    id: "theta-waves",
    name: "Theta Waves",
    url: "https://radio.stereoscenic.com/theta-h", // Theta wave binaural beats
  },
  {
    id: "white-noise",
    name: "White Noise",
    url: "https://radio.stereoscenic.com/purenoise-h", // Pure white noise stream
  }
];