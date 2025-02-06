
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
    url: "https://radio.stereoscenic.com/asm-h",
  },
  {
    id: "minimal",
    name: "Minimal",
    url: "https://ice1.somafm.com/groovesalad-128-mp3",
  },
  {
    id: "alpha-waves",
    name: "Alpha Waves Focus",
    url: "https://radio.stereoscenic.com/asp-h",
  },
  {
    id: "study-beats",
    name: "Lo-Fi Study",
    url: "https://radio.stereoscenic.com/asm-h",
  },
  {
    id: "nature-ambient",
    name: "Nature Sounds",
    url: "https://radio.stereoscenic.com/nat-h",
  },
  {
    id: "deep-focus",
    name: "Deep Focus",
    url: "https://ice1.somafm.com/dronezone-128-mp3",
  },
  {
    id: "minimal-piano",
    name: "Minimal Beats",
    url: "https://ice1.somafm.com/deepspaceone-128-mp3",
  },
  {
    id: "theta-waves",
    name: "Theta Waves",
    url: "https://radio.stereoscenic.com/theta-h",
  },
  {
    id: "brown-noise",
    name: "Brown Noise",
    url: "https://streams.relaxfm.ee/brown-noise"
  }
];
