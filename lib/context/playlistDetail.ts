import { createContext } from 'react';
import { Playlist } from '../models';

type PlaylistDetailContextProps = {
  playlist: Playlist | null;
  setPlaylist: (playlist: Playlist) => void;
  playIndex: number;
  setPlayIndex: (index: number) => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  duration: number;
  setDuration: (volume: number) => void;
  progress: number;
  setProgress: (volume: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  forcePlay: boolean;
  setForcePlay: (force: boolean) => void;
};

const PlaylistDetailContext = createContext<PlaylistDetailContextProps>({
  playlist: null,
  setPlaylist: (playlist: Playlist) => {},
  playIndex: -1,
  setPlayIndex: (index: number) => {},
  playing: false,
  setPlaying: (playing: boolean) => {},
  duration: 0,
  setDuration: (duration: number) => {},
  progress: 0,
  setProgress: (progress: number) => {},
  volume: 0,
  setVolume: (volume: number) => {},
  forcePlay: false,
  setForcePlay: (force: boolean) => {},
});

export default PlaylistDetailContext;
