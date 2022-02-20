import { useContext, useCallback, useState } from 'react'
import { ListGroupItem } from 'react-bootstrap';
import { useDrop } from 'react-dnd';
import axios from 'axios';
import classnames from 'classnames';

import { PlaylistEntry } from "@/lib/types/playlist";
import { ItemWithiTunes, PODCAST_EPISODE } from '@/lib/types/podcast';
import PodcastsContext from '@/lib/context/podcasts';

import styles from './Playlist.module.scss';

type PlaylistProps = {
  list: PlaylistEntry;
  onEdit: Function;
};

const Playlist = ({ list, onEdit }: PlaylistProps) => {
  const [saving, setSaving] = useState(false);
  const context = useContext(PodcastsContext);

  const handleDrop = useCallback(async (episode: ItemWithiTunes) => {
    setSaving(true);

    await axios.post('/api/playlists/add-item', {
      id: list.id,
      mediaUrl: episode.enclosure.url,
      collectionId: context.podcast.collectionId,
    });
    setSaving(false);
  }, [context.podcast, list.id]);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [PODCAST_EPISODE],
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  let backgroundColor = null;

  if (isActive) {
    backgroundColor = 'lightblue';
  }

  return (
    <ListGroupItem
      key={list.id}
      onClick={() => onEdit(list)}
      className={classnames(styles.item, { [styles.active]: isActive })}
      ref={drop}
      action
    >
      {list.name}
      {saving && <>...</>}
    </ListGroupItem>
  );
};

export default Playlist;
