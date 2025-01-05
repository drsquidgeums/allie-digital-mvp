export interface MusicOption {
  id: string;
  name: string;
  url: string;
}

export const MUSIC_OPTIONS: MusicOption[] = [
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