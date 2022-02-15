/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Form, Modal, Button, Col, Row } from 'react-bootstrap';
import { mutate } from 'swr';
import Link from 'next/link';
import axios from 'axios';
import update from 'immutability-helper'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Playlist from "@/lib/models/playlist";
import PlaylistItem from "@/lib/models/playlistItem";

import styles from './PlaylistEditor.module.scss';
import PlaylistItemComponent from './PlaylistItem';
import Icon from './Icon';

type PlaylistEditorProps = {
  playlist: Playlist;
  show: boolean;
  onHide: Function;
};

const PlaylistEditor = ({ playlist, show, onHide }: PlaylistEditorProps) => {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState(playlist);
  const [items, setItems] = useState<PlaylistItem[]>([]);
  const [removed, setRemoved] = useState<PlaylistItem[]>([]);
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

  const savePlaylist = useCallback(async (e?) => {
    if (e) {
      e.preventDefault();
    }

    setSaving(true);

    try {
      await axios.post('/api/playlists/save', {
        id: list.id,
        name: list.name,
        description: list.description,
        items,
        removed,
      });

      onHide();
      mutate('/api/playlists/mine');
    } catch (ex) {
      alert(ex.message || 'Error saving playlist');
    } finally {
      setSaving(false);
    }
  }, [onHide, list, items, removed]);

  const deletePlaylist = useCallback(async () => {
    const doRemove = confirm('Are you sure you want to delete this playlist?');

    if (!doRemove) {
      return;
    }

    setDeleting(true);
    try {
      await axios.post('/api/playlists/delete', { id: list.id });
      mutate('/api/playlists/mine');
      onHide();
    } catch (ex) {
      alert(ex.message || 'Error deleting playlist');
    } finally {
      setDeleting(false);
    }
  }, [list.id, onHide]);

  const removeItem = useCallback((itm: PlaylistItem) => {
    const doRemove = confirm(`Are you sure you want to remove "${itm.title}?"`);

    if (!doRemove) {
      return;
    }

    setRemoved([...removed, itm]);
    setItems(items.filter((item) => item !== itm));
  }, [items, removed]);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setItems((prevItems: PlaylistItem[]) =>
        update(prevItems, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevItems[dragIndex] as PlaylistItem],
          ],
        }),
      );
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  return (
    <Modal
      size="lg"
      backdrop="static"
      show={show}
      keyboard={false}
      onHide={() => !saving && onHide()}
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Edit Playlist
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={savePlaylist} ref={form}>
          <Row className="d-flex align-items-center">
            <Col sm={9}>
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
                  className="mb-3"
                  value={list.description || ''}
                  onChange={updateValue}
                />
              </Form.Group>
            </Col>
            <Col sm={3}>
              <ul className="list-unstyled text-end">
                <li>
                  <Link href={`/playlist/${list.id}`}>
                    <a target="_blank">
                      Detail Page
                      <Icon icon="globe" fixedWidth className="ms-2" />
                    </a>
                  </Link>
                </li>
                <li className="my-2">
                  <Link href={`/api/rss/${list.id}`}>
                    <a target="_blank">
                      RSS Feed
                      <Icon icon="rss" fixedWidth className="ms-2" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={`/api/m38/${list.id}`}>
                    <a target="_blank">
                      MP3 Playlist
                      <Icon icon="file-audio" fixedWidth className="ms-2" />
                    </a>
                  </Link>
                </li>
              </ul>
            </Col>
          </Row>
          <hr />
          {loading && <div>Loading...</div>}
          {!loading && items.length === 0 && (
            <Alert variant="info">
              <Alert.Heading>No Episodes</Alert.Heading>
              This playlist does not contain any podcast episodes.
            </Alert>
          )}
          <DndProvider backend={HTML5Backend}>
            {items.map((item, i) => (
              <PlaylistItemComponent
                key={item.id}
                index={i}
                item={item}
                onRemove={removeItem}
                onMove={moveItem}
              />
            ))}
          </DndProvider>
          <button type="submit" className="visually-hidden">Save</button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <div className={styles.footer}>
          <Button variant="outline-danger" className="mr-auto" onClick={deletePlaylist} disabled={saving || deleting}>
            {deleting ? 'Deleting' : 'Delete Playlist'}
          </Button>
          <div>
            <Button variant="outline-secondary" onClick={() => onHide()} disabled={saving || deleting}>
              Close
            </Button>
            &nbsp;
            <Button variant="success" onClick={() => savePlaylist()} disabled={saving || deleting}>
              {saving ? 'Saving' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default PlaylistEditor;
