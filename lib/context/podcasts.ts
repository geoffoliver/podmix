import { createContext } from 'react';
import { Podcast } from '../types/podcast';

const PodcastsContext = createContext<{ podcast: Podcast, setPodcast: Function }>({
  podcast: null,
  setPodcast: (p: Podcast) => {},
});

export default PodcastsContext;
