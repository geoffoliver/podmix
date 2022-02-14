import { useCallback, useState } from 'react';
import axios from 'axios';
import { Button, Form, InputGroup } from 'react-bootstrap';

import { Podcast as PodcastType } from '@/lib/types/podcast';
import Podcast from './Podcast';

import styles from './Podcasts.module.scss';

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
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search For Podcast"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </InputGroup>
      </form>
      <div className={styles.podcasts}>
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
      </div>
    </>
  )
};

export default Podcasts;
