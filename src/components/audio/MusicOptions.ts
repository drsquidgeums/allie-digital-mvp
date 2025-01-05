export interface MusicOption {
  id: string;
  name: string;
  url: string;
}

export const MUSIC_OPTIONS: MusicOption[] = [
  {
    id: "classic",
    name: "Classic FM",
    url: "https://media-ssl.musicradio.com/ClassicFM", // Classic FM live stream URL
  },
  {
    id: "ambient",
    name: "Ambient",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3", // Ambient Meditation
  },
];