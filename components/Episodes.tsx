/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import Parser from 'rss-parser';

import { ItemWithiTunes } from '@/lib/types/podcast';
import Episode from './Episode';
import styles from './Episodes.module.scss';

type EpisodesProps = {
  feed: Parser.Output<any>;
  loading: boolean;
}

const Episodes = ({ feed, loading }: EpisodesProps) => {
  const [filtered, setFiltered] = useState<ItemWithiTunes[]>(feed?.items || []);
  const [filter, setFilter] = useState('');

  const filterEpisodes = useCallback((e) => {
    e.preventDefault();

    if (filter === '') {
      setFiltered(feed.items);
      return;
    }

    const filt = filter.toLocaleLowerCase();

    setFiltered(feed.items.filter((e) => {
      return (
        e.title.toLocaleLowerCase().includes(filt)
        || e.content.toLocaleLowerCase().includes(filt)
      );
    }));
  }, [feed?.items, filter]);

  if (!feed) {
    return null;
  }

  return (
    <>
      <form onSubmit={filterEpisodes}>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search Episodes"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </InputGroup>
      </form>
      <div className={styles.episodes}>
        {loading
          ? <div>Loading...</div>
          : filtered.map((ep) => (
              <Episode
                key={ep.guid}
                item={ep}
                feedImage={feed.image ? feed.image.url : feed.itunes?.image}
              />
            ))
        }
      </div>
    </>
  );
};

export default Episodes;
