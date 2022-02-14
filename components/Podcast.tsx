/* eslint-disable @next/next/no-img-element */

import { Podcast as PodcastType } from '@/lib/types/podcast';

import styles from './Podcast.module.scss';

export type PodcastProps = {
  podcast: PodcastType;
  onClick: Function;
};

const Podcast = ({ podcast, onClick }: PodcastProps) => {
  return (
    <div className={styles.podcast}>
      <button onClick={() => onClick(podcast) }>
        <img src={podcast.artworkUrl100} alt={`Artwork for ${podcast.collectionName}`} className="img-fluid" loading="lazy" />
        <div className={styles.name}>{podcast.collectionName}</div>
      </button>
    </div>
  )
};

export default Podcast;
