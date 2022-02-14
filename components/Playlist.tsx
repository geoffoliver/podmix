import { useContext, useState } from 'react'
import { ListGroupItem } from 'react-bootstrap';
import { useDrop } from 'react-dnd';
import axios from 'axios';

import { PlaylistEntry } from "@/lib/types/playlist";
import { ItemWithiTunes, Podcast, PODCAST_EPISODE } from '@/lib/types/podcast';
import { useCallback } from 'react';
import PodcastsContext from '@/lib/context/podcasts';

type PlaylistProps = {
  list: PlaylistEntry;
  onEdit: Function;
};

const Playlist = ({ list, onEdit }: PlaylistProps) => {
  const [saving, setSaving] = useState(false);
  const context = useContext(PodcastsContext);

  const handleDrop = useCallback(async (episode: ItemWithiTunes) => {
    setSaving(true);

    console.log(context);
    console.log(episode);

    const image = (episode.itunes && episode.itunes.image)
      ? episode.itunes.image
      : context.podcast.artworkUrl600;

    await axios.post('/api/playlists/add-item', {
      id: list.id,
      mediaUrl: episode.enclosure.url,
      link: episode.link,
      title: episode.title,
      pubDate: new Date(episode.pubDate),
      collectionId: context.podcast.collectionId,
      collectionName: context.podcast.collectionName,
      artistName: context.podcast.artistName,
      description: episode.contentSnippet,
      duration: episode.itunes?.duration,
      image,
    });
    setSaving(false);
  }, [context, list]);

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
