/* eslint-disable @next/next/no-img-element */
import { useContext } from 'react';
import classnames from 'classnames';

import PodcastsContext from '@/lib/context/podcasts';
import { Podcast as PodcastType } from '@/lib/types/podcast';

import styles from './Podcast.module.scss';

export type PodcastProps = {
  podcast: PodcastType;
  onClick: Function;
};

const Podcast = ({ podcast, onClick }: PodcastProps) => {
  const context = useContext(PodcastsContext);

  return (
    <div className={classnames(styles.podcast, { [styles.active]: context.podcast === podcast})}>
      <button onClick={() => onClick(podcast) }>
        <img src={podcast.artworkUrl100} alt={`Artwork for ${podcast.collectionName}`} className="img-fluid" loading="lazy" />
        <div className={styles.name}>{podcast.collectionName}</div>
      </button>
    </div>
  )
};

export default Podcast;
