/* eslint-disable @next/next/no-img-element */
import truncate from 'truncate';

import { ItemWithiTunes, PODCAST_EPISODE } from '@/lib/types/podcast';
import styles from './Episode.module.scss';
import { useDrag } from 'react-dnd';

export type EpisodeProps = {
  item: ItemWithiTunes;
  feedImage: string;
};

const Episode = ({ item, feedImage }: EpisodeProps) => {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: PODCAST_EPISODE,
      item,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [],
  )

  return (
    <div className={styles.episode} ref={drag} style={{ opacity }}>
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
