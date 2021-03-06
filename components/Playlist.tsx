/* eslint-disable @next/next/no-img-element */
import { useContext, useCallback, useState, useEffect } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import { useDrop } from 'react-dnd';
import axios from 'axios';
import classnames from 'classnames';

import { PlaylistEntry } from '@/lib/types/playlist';
import { ItemWithiTunes, PODCAST_EPISODE } from '@/lib/types/podcast';
import PodcastsContext from '@/lib/context/podcasts';
import Icon from '@/components/Icon';

import styles from '@/styles/Playlist.module.scss';
import { toast } from 'react-toastify';

type PlaylistProps = {
  list: PlaylistEntry;
  onEdit: Function;
};

let flashTimeout = null;

const Playlist = ({ list, onEdit }: PlaylistProps) => {
  const [saving, setSaving] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const context = useContext(PodcastsContext);

  const handleDrop = useCallback(async (episode: ItemWithiTunes) => {
    setSaving(true);

    await axios.post('/api/playlists/add-item', {
      id: list.id,
      mediaUrl: episode.enclosure.url,
      collectionId: context.podcast.collectionId,
    });

    toast.success('Item added to playlist');

    setSaving(false);
    setFlashing(true);

    flashTimeout = setTimeout(() => {
      setFlashing(false);
    }, 400);
  }, [context.podcast, list.id]);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [PODCAST_EPISODE],
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  useEffect(() => {
    return () => {
      clearTimeout(flashTimeout);
    };
  }, []);

  const isActive = isOver && canDrop;

  return (
    <ListGroupItem
      key={list.id}
      onClick={() => onEdit(list)}
      className={classnames(styles.item, { [styles.active]: isActive, [styles.flashing]: flashing, [styles.saving]: saving })}
      ref={drop}
      action
    >
      <img src={`/api/playlists/image/${list.id}`} alt={`Image for ${list.name}`} className={styles.playlistImage} />
      {list.name}
      {saving && <Icon icon="spinner" className="ms-2" spin fixedWidth />}
    </ListGroupItem>
  );
};

export default Playlist;
