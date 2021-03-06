/* eslint-disable @next/next/no-img-element */
import { useContext } from 'react';
import classnames from 'classnames';
// import Image from 'next/image'

import PodcastsContext from '@/lib/context/podcasts';
import { iTunesResult } from '@/lib/external/itunes';

import styles from '@/styles/Podcast.module.scss';

export type PodcastProps = {
  podcast: iTunesResult;
  onClick: Function;
};

const Podcast = ({ podcast, onClick }: PodcastProps) => {
  const context = useContext(PodcastsContext);

  return (
    <div className={classnames(styles.podcast, { [styles.active]: context.podcast === podcast})}>
      <button onClick={() => onClick(podcast) }>
        {/* <Image src={podcast.artworkUrl100} alt={`Artwork for ${podcast.collectionName}`} width="100" height="100"/> */}
        <img src={podcast.artworkUrl100} alt={`Artwork for ${podcast.collectionName}`} className="img-fluid" loading="lazy" />
        <div className={styles.name}>{podcast.collectionName}</div>
      </button>
    </div>
  );
};

export default Podcast;
