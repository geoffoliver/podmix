import { PlaylistEntry } from '@/lib/types/playlist';
import { useCallback, useEffect, useState } from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import axios from 'axios';

const Playlists = () => {
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState<PlaylistEntry[]>([]);

  const getPlaylists = useCallback(async () => {
    setLoading(true);
    const result = await axios.get('/api/playlists');
    setLists(result.data.playlists);
    setLoading(false);
  }, []);

  const addList = useCallback(async () => {
    const name = prompt('What do you want to name the playlist?');
    if (!name || name.trim() === '') {
      return;
    }

    const result = await axios.post('/api/playlists/add', {
      name
    });

    setLists([...lists, result.data.playlist]);
  }, [lists]);

  useEffect(() => {
    getPlaylists();
  }, [getPlaylists]);

  return (
    <div>
      <div className="d-flex flex-row align-items-center justify-content-between">
        <div>Playlists</div>
        <Button onClick={addList} size="sm" variant="outline-primary">Add</Button>
      </div>
      {loading && <div>Loading...</div>}
      {lists.length === 0 && <div>No playlists</div>}
      <ListGroup>
        {lists.map((list) => (
          <ListGroupItem key={list.id}>{list.name}</ListGroupItem>
        ))}
      </ListGroup>
    </div>
  )
};

export default Playlists;
