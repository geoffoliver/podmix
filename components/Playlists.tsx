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
    <div className={styles.playlistsContainer}>
      <div className={styles.header}>
        <h4>My Playlists</h4>
        <Button onClick={addList} size="sm" variant="outline-primary">Add</Button>
      </div>
      {error && <div>{JSON.stringify(error)}</div>}
      {isValidating && lists.length === 0 && <div>Loading...</div>}
      {!isValidating && lists.length === 0 && (
        <div className={styles.noPlaylists}>
          <h6>You don&apos;t have any playlists!</h6>
          <p>
            Create your first playlist using one of the &ldquo;Add&rdquo;
            buttons that appear above and below this message. Then you can add
            episodes to it by draging and dropping them on the playlist.
          </p>
          <p>
            <Button variant="outline-primary" size="sm" onClick={addList}>
              Add Playlist
            </Button>
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
