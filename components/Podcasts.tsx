import { useCallback, useState } from 'react';
import axios from 'axios';

import { Podcast as PodcastType } from '@/lib/types/podcast';
import Podcast from './Podcast';

type PodcastsProps = {
  onClick: Function;
};

const Podcasts = ({ onClick }: PodcastsProps) => {
  const [results, setResults] = useState<PodcastType[]>([]);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const search = useCallback(async (e) => {
    e.preventDefault();
    setSearching(true);
    const resp = await axios.post('/api/search-podcasts', {
      search: query,
    });

    setSearching(false);
    setResults(resp.data.results || [])
  }, [query]);


  return (
    <>
      <form onSubmit={search}>
        <input
          type="text"
          placeholder="Search For Podcast"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {searching
        ? <>Searching...</>
        : results.map((result: PodcastType) => (
          <Podcast
            key={result.collectionId}
            podcast={result}
            onClick={onClick}
          />
        ))
      }
    </>
  )
};

export default Podcasts;
