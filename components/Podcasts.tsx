import { useCallback, useState } from 'react';
import axios from 'axios';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { iTunesResult } from '@/lib/external/itunes';
import Icon from '@/components/Icon';

import Podcast from './Podcast';

import styles from '@/styles/Podcasts.module.scss';

type PodcastsProps = {
  onClick: Function;
};

const Podcasts = ({ onClick }: PodcastsProps) => {
  const [results, setResults] = useState<iTunesResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState('');

  const search = useCallback(async (e) => {
    e.preventDefault();
    setSearching(true);
    const resp = await axios.post('/api/search-podcasts', {
      search: query,
    });

    setSearching(false);
    setSearched(query);
    setResults(resp.data.results || []);
  }, [query]);

  const Row = ({ index, style }) => {
    return (
      <div style={style} className={styles.show}>
        <Podcast
          podcast={results[index]}
          onClick={onClick}
        />
      </div>
    );
  };

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
          <Button type="submit" variant="outline-secondary">Search</Button>
        </InputGroup>
      </form>
      <div className={styles.podcasts}>
        {searching
          ? (
            <div className="py-3 text-center">
              <Icon icon="spinner" className="me-2" spin fixedWidth />
              Searching Podcasts...
            </div>
          ) : (
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeList
                  height={height}
                  width={width}
                  itemCount={results.length}
                  itemSize={90}
                >
                  {Row}
                </FixedSizeList>
              )}
            </AutoSizer>
          )
        }
        {!searching && searched && results.length === 0 && (
          <div className="text-muted text-center p-3">
            No results for &ldquo;{searched}&rdquo;
          </div>
        )}
        {!searching && searched === '' && results.length === 0 && (
          <div className="text-muted text-center p-3">
            Search for a podcast with the field above
          </div>
        )}
      </div>
    </>
  );
};

export default Podcasts;
