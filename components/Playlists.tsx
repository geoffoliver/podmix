import { PlaylistEntry } from '@/lib/types/playlist';
import { useCallback, useEffect, useState } from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import axios from 'axios';
import useSWR from 'swr';

import Playlist from '@/components/Playlist';

type PlaylistsProps = {
  onEdit: Function;
}

const Playlists = ({ onEdit }: PlaylistsProps) => {
  const [lists, setLists] = useState<PlaylistEntry[]>([]);
  const { data, error, isValidating } = useSWR('/api/playlists/mine', axios);

  const addList = useCallback(async () => {
    const name = prompt('What do you want to name the playlist?');
    if (!name || name.trim() === '') {
      return;
    }

    const result = await axios.post('/api/playlists/add', {
      name
    });

    setLists([result.data.playlist, ...lists]);
  }, [lists]);

  useEffect(() => {
    if (data && data.data && data.data.playlists) {
      setLists(data.data.playlists);
    }
  }, [data]);

  return (
    <div>
      <div className="d-flex flex-row align-items-center justify-content-between mb-2">
        <div><strong>Playlists</strong></div>
        <Button onClick={addList} size="sm" variant="link">Add</Button>
      </div>
      {error && <div>{JSON.stringify(error)}</div>}
      {isValidating && lists.length === 0 && <div>Loading...</div>}
      {!isValidating && lists.length === 0 && <div>No playlists</div>}
      <ListGroup>
        {lists.map((list) => (
          <Playlist key={list.id} list={list} onEdit={onEdit} />
        ))}
      </ListGroup>
    </div>
  )
};

export default Playlists;
