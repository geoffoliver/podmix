/* eslint-disable @next/next/no-img-element */
import { useMemo } from 'react';

import Playlist from '@/lib/models/playlist';

type PlaylistImageProps = {
  playlist: Playlist;
};

import styles from './PlaylistImage.module.scss';

const PlaylistImage = ({ playlist }: PlaylistImageProps) => {
  const images = useMemo(() => {
    if (!playlist.items || playlist.items.length === 0) {
      return ['/playlist-placeholder.png'];
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
};

export default PlaylistImage;
