import { useState } from 'react'
import { ListGroupItem } from 'react-bootstrap';
import { useDrop } from 'react-dnd';
import axios from 'axios';

import { PlaylistEntry } from "@/lib/types/playlist";
import { PODCAST_EPISODE } from '@/lib/types/podcast';
import { useCallback } from 'react';

type PlaylistProps = {
  list: PlaylistEntry;
  onEdit: Function;
};

const Playlist = ({ list, onEdit }: PlaylistProps) => {
  const [saving, setSaving] = useState(false);

  const handleDrop = useCallback(async (episode) => {
    setSaving(true);
    const result = await axios.post('/api/playlists/add-item', {
      id: list.id,
      url: episode.enclosure.url,
    });
    setSaving(false);
  }, [list]);

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
      style={{ backgroundColor }}
      ref={drop}
      action
    >
      {list.name}
      {saving && <>...</>}
    </ListGroupItem>
  );
};

export default Playlist;
