import { createContext } from 'react';
import { Playlist } from '../models';

type PlaylistDetailContextProps = {
  playlist: Playlist | null;
  setPlaylist: (_playlist: Playlist) => void;
  playIndex: number;
  setPlayIndex: (_index: number) => void;
  playing: boolean;
  setPlaying: (_playing: boolean) => void;
  duration: number;
  setDuration: (_volume: number) => void;
  progress: number;
  setProgress: (_volume: number) => void;
  volume: number;
  setVolume: (_volume: number) => void;
  forcePlay: boolean;
  setForcePlay: (_force: boolean) => void;
};

const PlaylistDetailContext = createContext<PlaylistDetailContextProps>({
  playlist: null,
  setPlaylist: (_playlist: Playlist) => {},
  playIndex: -1,
  setPlayIndex: (_index: number) => {},
  playing: false,
  setPlaying: (_playing: boolean) => {},
  duration: 0,
  setDuration: (_duration: number) => {},
  progress: 0,
  setProgress: (_progress: number) => {},
  volume: 0,
  setVolume: (_volume: number) => {},
  forcePlay: false,
  setForcePlay: (_force: boolean) => {},
});

export default PlaylistDetailContext;
