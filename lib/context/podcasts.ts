import { createContext } from 'react';
import { iTunesResult } from '../external/itunes';

const PodcastsContext = createContext<{ podcast: iTunesResult, setPodcast: Function }>({
  podcast: null,
  setPodcast: (_p: iTunesResult) => {},
});

export default PodcastsContext;
