import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import Playlist from "@/lib/models/playlist";
import PlaylistItem from "@/lib/models/playlistItem";
import Podcast from './Podcast';

type PlaylistEditorProps = {
  playlist: Playlist;
};

const PlaylistEditor = ({ playlist }: PlaylistEditorProps) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState(playlist);
  const [items, setItems] = useState<PlaylistItem[]>([]);

  const loadList = useCallback(async () => {
    setLoading(true);
    const result = await axios.post('/api/playlists/items', {
      id: list.id,
    });

    setItems(result.data.items);
    setLoading(false);
  }, [list]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  return (
    <div>
      Playlist editor
      <pre>{JSON.stringify(list, null, 2)}</pre>
      <hr />
      {loading && <div>Loading...</div>}
      {items.map((item) => (
        <div key={item.id}>
          <h5>{item.url}</h5>
        </div>
      ))}
    </div>
  );
};

export default PlaylistEditor;
