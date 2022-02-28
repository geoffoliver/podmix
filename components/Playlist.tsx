import { useContext, useCallback, useState, useEffect } from 'react'
import { ListGroupItem } from 'react-bootstrap';
import { useDrop } from 'react-dnd';
import axios from 'axios';
import classnames from 'classnames';

import { PlaylistEntry } from "@/lib/types/playlist";
import { ItemWithiTunes, PODCAST_EPISODE } from '@/lib/types/podcast';
import PodcastsContext from '@/lib/context/podcasts';
import Icon from '@/components/Icon';

import styles from '@/styles/Playlist.module.scss';

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

    setSaving(false);
    setFlashing(true);
    flashTimeout = setTimeout(() => {
      setFlashing(false);
    }, 750);
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
      {list.name}
      {saving && <Icon icon="spinner" spin fixedWidth />}
    </ListGroupItem>
  );
};

export default Playlist;
