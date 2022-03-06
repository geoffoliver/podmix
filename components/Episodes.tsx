/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import Parser from 'rss-parser';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import Icon from '@/components/Icon';
import { ItemWithiTunes } from '@/lib/types/podcast';
import styles from '@/styles/Episodes.module.scss';

import Episode from './Episode';

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
        || e.guid.includes(filt)
      );
    }));
  }, [feed?.items, filter]);

  const Row = ({ index, style }) => {
    return (
      <div style={style} className={styles.episode}>
        <Episode
          item={filtered[index]}
          feedImage={feed.image ? feed.image.url : feed.itunes?.image}
        />
      </div>
    );
  };

  return (
    <>
      {feed && <form onSubmit={filterEpisodes}>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search Episodes"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button type="submit" variant="outline-secondary">Search</Button>
        </InputGroup>
      </form>}
      <div className={styles.episodes}>
        {loading ? (
          <div className="py-3 text-center">
            <Icon icon="spinner" className="me-2" spin fixedWidth />
            Loading Feed...
          </div>
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemCount={filtered.length}
                itemSize={108}
              >
                {Row}
              </FixedSizeList>
            )}
          </AutoSizer>
        )}
      </div>
    </>
  );
};

export default Episodes;
