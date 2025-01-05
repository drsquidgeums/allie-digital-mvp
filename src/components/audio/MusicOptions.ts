export interface MusicOption {
  id: string;
  name: string;
  url: string;
}

export const MUSIC_OPTIONS: MusicOption[] = [
  {
    id: "classical",
    name: "Classical Piano",
    url: "https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe5a085.mp3", // Peaceful Piano Song
  },
  {
    id: "ambient",
    name: "Ambient Nature",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3", // Ambient Meditation
  },
  {
    id: "electronic",
    name: "Minimal Electronic",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3", // Electronic Ambient
  },
];