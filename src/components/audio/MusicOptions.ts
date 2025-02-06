export interface MusicOption {
  id: string;
  name: string;
  url: string;
}

export const MUSIC_OPTIONS: MusicOption[] = [
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
    url: "http://ice1.somafm.com/dronezone-128-mp3", // SomaFM Drone Zone
  },
  {
    id: "space-ambient",
    name: "Space Dreams",
    url: "http://ice1.somafm.com/spacestationsom-128-mp3", // SomaFM Space Station
  },
  {
    id: "minimal-piano",
    name: "Minimal Piano",
    url: "http://ice1.somafm.com/cliqhop-128-mp3", // SomaFM cliqhop
  },
  {
    id: "theta-waves",
    name: "Theta Waves",
    url: "https://radio.stereoscenic.com/theta-h", // Theta wave binaural beats
  },
  {
    id: "white-noise",
    name: "White Noise",
    url: "https://radio.stereoscenic.com/wn-h", // White noise stream
  }
];