/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from 'react';
import Parser from 'rss-parser';

import Episode from './Episode';
import { ItemWithiTunes } from '@/lib/types/podcast';

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

  if (loading) {
    return <div>Loading episodes...</div>
  }

  if (!feed) {
    return null;
  }

  return (
    <>
      <form onSubmit={filterEpisodes}>
        <input
          type="text"
          placeholder="Search Episodes"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {filtered.map((ep) => (
          <Episode
            key={ep.guid}
            item={ep}
            feedImage={feed.image ? feed.image.url : feed.itunes?.image}
          />
        ))}
      </div>
    </>
  );
};

export default Episodes;
