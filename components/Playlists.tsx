import { PlaylistEntry } from '@/lib/types/playlist';
import { useCallback, useEffect, useState } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import useSWR from 'swr';

import Playlist from '@/components/Playlist';

import styles from '@/styles/Playlists.module.scss';

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
      name,
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
      <div className={styles.header}>
        <div><strong>My Playlists</strong></div>
        <Button onClick={addList} size="sm" variant="link">Add</Button>
      </div>
      {error && <div>{JSON.stringify(error)}</div>}
      {isValidating && lists.length === 0 && <div>Loading...</div>}
      {!isValidating && lists.length === 0 && (
        <div className={styles.noPlaylists}>
          <h6>You don&apos;t have any playlists!</h6>
          <p>
            Click the &ldquo;Add&rdquo; link above to create your first
            playlist. Then you can add episodes to it by draging and dropping
            them on the playlist.
          </p>
        </div>
      )}
      <div className={styles.playlists}>
        <ListGroup>
          {lists.map((list) => (
            <Playlist key={list.id} list={list} onEdit={onEdit} />
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default Playlists;
