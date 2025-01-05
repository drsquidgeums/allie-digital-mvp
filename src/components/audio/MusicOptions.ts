export interface MusicOption {
  id: string;
  name: string;
  url: string;
}

export const MUSIC_OPTIONS: MusicOption[] = [
  {
    id: "classical",
    name: "Classical Piano",
    url: "https://cdn.pixabay.com/download/audio/2023/09/24/audio_7b6a59a9af.mp3", // Soft Piano Background Music
  },
  {
    id: "ambient",
    name: "Ambient Nature",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3", // Ambient Meditation
  },
  {
    id: "electronic",
    name: "Minimal Electronic",
    url: "https://cdn.pixabay.com/download/audio/2022/01/26/audio_31743c8c24.mp3", // Minimal Technology Background
  },
];