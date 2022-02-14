/* eslint-disable @next/next/no-img-element */
import truncate from 'truncate';

import { ItemWithiTunes } from '@/lib/types/podcast';
import styles from './Episode.module.scss';

export type EpisodeProps = {
  item: ItemWithiTunes;
  feedImage: string;
};

const Episode = ({ item, feedImage }: EpisodeProps) => {
  return (
    <div className={styles.episode}>
      <img
        src={
          (item.itunes && item.itunes.image)
            ? item.itunes.image
            : feedImage
        }
        alt="Image"
        className="img-flulid"
        loading="lazy"
      />
      <div className={styles.info}>
        <div className={styles.title}>{item.title}</div>
        <p className="small">{truncate(item.contentSnippet, 100)}</p>
      </div>
    </div>
  )
};

export default Episode;
