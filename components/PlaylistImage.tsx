/* eslint-disable @next/next/no-img-element */
// import { useMemo } from 'react';

import Playlist from '@/lib/models/playlist';

type PlaylistImageProps = {
  playlist: Playlist;
};

import styles from './PlaylistImage.module.scss';

// const DEFAULT_PLAYLIST_IMAGE = '/playlist-placeholder.png';

const PlaylistImage = ({ playlist }: PlaylistImageProps) => {
  return (
    <div className={styles.images}>
      <img src={`/api/playlists/image/${playlist.id}`} alt={`Image for ${playlist.name}`} />
    </div>
  )
  /*
  const images = useMemo(() => {
    if (!playlist.items || playlist.items.length === 0) {
      return [DEFAULT_PLAYLIST_IMAGE];
    }

    const img: string[] = [];

    playlist.items.some((item) => {
      if (!img.includes(item.image)) {
        img.push(item.image);
      }
      return img.length === 4;
    });

    if (img.length > 1) {
      while (img.length < 4) {
        img.push(DEFAULT_PLAYLIST_IMAGE);
      }
    }

    return img;
  }, [playlist]);

  return (
    <div className={styles.images}>
      {images.map((img) => (
        <img
          key={img}
          src={img}
          alt={`Image for ${img}`}
          loading="lazy"
        />
      ))}
    </div>
  );
  */
};

export default PlaylistImage;
