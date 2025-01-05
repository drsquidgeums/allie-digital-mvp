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
    id: "ambient",
    name: "Ambient",
    url: "https://radio.stereoscenic.com/asm-h", // Ambient Sleeping Pill radio - free ambient music stream
  },
  {
    id: "minimal",
    name: "Minimal",
    url: "http://ice1.somafm.com/groovesalad-128-mp3", // SomaFM Groove Salad - electronic/downtempo
  },
];