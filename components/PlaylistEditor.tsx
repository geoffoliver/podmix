/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Alert, Form, Modal, Button, Table } from 'react-bootstrap';
import { DateTime } from 'luxon';

import Playlist from "@/lib/models/playlist";
import PlaylistItem from "@/lib/models/playlistItem";

import styles from './PlaylistEditor.module.scss';

type PlaylistEditorProps = {
  playlist: Playlist;
  show: boolean;
  onHide: Function;
};

const PlaylistEditor = ({ playlist, show, onHide }: PlaylistEditorProps) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState(playlist);
  const [items, setItems] = useState<PlaylistItem[]>([]);
  const form = useRef(null);

  const loadList = useCallback(async () => {
    if (!show) {
      return;
    }

    setLoading(true);
    const result = await axios.post('/api/playlists/items', {
      id: list.id,
    });

    setItems(result.data.items);
    setLoading(false);
  }, [list.id, show]);

  const updateValue = useCallback(async (e) => {
    setList({
      ...list,
      [e.target.name]: e.target.value,
    } as Playlist);
  }, [list]);

  const savePlaylist = useCallback((e?) => {
    if (e) {
      e.preventDefault();
    }
    console.log(list);
    console.log(items);
    onHide();
  }, [onHide, list, items]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  return (
    <Modal show={show} size="lg" onHide={() => onHide()} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          Edit Playlist
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={savePlaylist} ref={form}>
          <Form.Group>
            <Form.Control
              name="name"
              placeholder="Name"
              value={list.name || ''}
              onChange={updateValue}
              className="mb-3"
              size="sm"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              as="textarea"
              placeholder="Description"
              name="description"
              size="sm"
              value={list.description || ''}
              onChange={updateValue}
            />
          </Form.Group>
          <hr />
          {loading && <div>Loading...</div>}
          {!loading && items.length === 0 && (
            <Alert variant="info">
              <Alert.Heading>No Episodes</Alert.Heading>
              This playlist does not contain any podcast episodes.
            </Alert>
          )}
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.titleContainer}>
                <img src={item.image} height="40" width="40" alt={`${item.title} image`} />
                <div className="ps-2">
                  <div className={styles.title}>{item.title}</div>
                  <div className="text-muted small">{item.duration}</div>
                </div>
              </div>
            </div>
          ))}
          <button type="submit" className="visually-hidden">Save</button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => onHide()}>
          Close
        </Button>
        <Button variant="success" onClick={() => savePlaylist()}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlaylistEditor;
