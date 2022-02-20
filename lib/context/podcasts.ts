import { createContext } from 'react';
import { iTunesResult } from '../external/itunes';

const PodcastsContext = createContext<{ podcast: iTunesResult, setPodcast: Function }>({
  podcast: null,
  setPodcast: (p: iTunesResult) => {},
});

export default PodcastsContext;
