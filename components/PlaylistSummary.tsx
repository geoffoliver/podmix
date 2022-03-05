/* eslint-disable @next/next/no-img-element */
import { useMemo } from 'react';
import Link from 'next/link';

import { Playlist } from '@/lib/models';

import styles from '@/styles/PlaylistSummary.module.scss';
import PlaylistImage from './PlaylistImage';
import { Truncate } from './ui/Truncate';

type PlaylistSummaryProps = {
  playlist: Playlist;
};

const PlaylistSummary = ({ playlist }: PlaylistSummaryProps) => {
  const images = useMemo(() => {
    if (!playlist.items || playlist.items.length === 0) {
      return null;
    }

    const img: string[] = [];

    playlist.items.some((item) => {
      if (!img.includes(item.image)) {
        img.push(item.image);
      }
      return img.length === 4;
    });

    return img;
  }, [playlist]);

  return (
    <div className={styles.summary}>
      <Link href={`/playlist/${playlist.id}`}>
        <a title={playlist.name}>
          <PlaylistImage playlist={playlist} />
        </a>
      </Link>
      <div className={styles.details}>
        <div className={styles.title}>
          <Link href={`/playlist/${playlist.id}`}>
            <a title={playlist.name}>
              <Truncate lines={1}>
                {playlist.name}
              </Truncate>
            </a>
          </Link>
        </div>
        <div className={styles.author} title={`By ${playlist.user.name}`}>
          <Truncate lines={1}>By {playlist.user.name}</Truncate>
        </div>
        {/* playlist.description && (
          <div className={styles.description} title={playlist.description}>
            <Truncate lines={2}>
              {playlist.description}
            </Truncate>
          </div>
        )*/}
      </div>
    </div>
  )
};

export default PlaylistSummary;
