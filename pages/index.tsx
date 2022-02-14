import { useCallback, useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import Head from 'next/head'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Playlists from '@/components/Playlists';
import PodcastBrowser from '@/components/PodcastBrowser';
import PlaylistEditor from '@/components/PlaylistEditor';
import Playlist from '@/lib/models/playlist';

export default function Home() {
  const [showEdit, setShowEdit] = useState(false);
  const [playlist, setPlaylist] = useState<Playlist>(null);

  const editPlaylist = useCallback((list) => {
    setPlaylist(list);
    setShowEdit(true);
  }, []);

  return (
    <>
      <Head>
        <title>Podlists</title>
      </Head>
      <DndProvider backend={HTML5Backend}>
        <Container className="mt-3">
          <Row>
            <Col md={2}>
              <Playlists onEdit={editPlaylist} />
            </Col>
            <Col md={10}>
              <PodcastBrowser />
            </Col>
          </Row>
        </Container>
      </DndProvider>
      <Modal show={showEdit} size="lg" onHide={() => setShowEdit(false)} scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            Edit Playlist
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {playlist && <PlaylistEditor playlist={playlist} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowEdit(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
