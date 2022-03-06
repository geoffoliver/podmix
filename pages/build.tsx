import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSession } from 'next-auth/react';

import Playlists from '@/components/Playlists';
import PodcastBrowser from '@/components/PodcastBrowser';
import PlaylistEditor from '@/components/PlaylistEditor';
import { Playlist } from '@/lib/models';
import PodcastsContext from '@/lib/context/podcasts';
import { iTunesResult } from '@/lib/external/itunes';

import styles from '@/styles/build.module.scss';
import Head from '@/components/Head';

export default function Build() {
  const [showEdit, setShowEdit] = useState(false);
  const [playlist, setPlaylist] = useState<Playlist>(null);
  const [podcast, setLocalPodcast] = useState<iTunesResult>(null);
  const [mounted, setMounted] = useState(false);
  const [ack, setAck] = useState(false);

  useSession({
    required: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const showInstructions = useMemo(() => {
    if (!mounted) {
      return false;
    }

    if (ack) {
      return false;
    }

    return localStorage.getItem('instructions') === null;
  }, [mounted, ack]);

  const editPlaylist = useCallback((list) => {
    setPlaylist(list);
    setShowEdit(true);
  }, []);

  const setPodcast = useCallback((p: iTunesResult) => {
    setLocalPodcast(p);
  }, []);

  const acknowledgeInstructions = useCallback(() => {
    setAck(true);
    localStorage.setItem('instructions', 'true');
  }, []);

  return (
    <>
      <Head title="Build Playlists" />
      <DndProvider backend={HTML5Backend}>
        <PodcastsContext.Provider value={{ podcast, setPodcast }}>
          <div className={styles.playlistBuilder}>
            <Container>
              <Row>
                <Col sm={3}>
                  <Playlists onEdit={editPlaylist} />
                </Col>
                <Col sm={9}>
                  <PodcastBrowser />
                </Col>
              </Row>
            </Container>
          </div>
        </PodcastsContext.Provider>
      </DndProvider>
      {playlist && (
        <PlaylistEditor
          playlist={playlist}
          key={playlist.id}
          show={showEdit}
          onHide={() => setShowEdit(false)}
        />
      )}
      <Modal size="lg" show={showInstructions} onHide={acknowledgeInstructions} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Playlist Builder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h1>Welcome to the playlist builder!</h1>
            <p className="lead">
              Please read these short instructions on how to use the playlist builder.
            </p>
          </div>
          <hr />
          <ol className="my-4">
            <li className="mb-4">
              <strong>Create a playlist using the &ldquo;Add&rdquo; link or button in the &ldquo;My Playlists&rdquo; section.</strong>
              <div className="small text-muted">
                You&apos;ll be prompted to enter a name for the playlist. Do that and hit &ldquo;Enter&rdquo; or click
                the &ldquo;OK&rdquo; button.
              </div>
            </li>
            <li className="mb-4">
              <strong>Search for a podcast.</strong>
              <div className="small text-muted">
                Use the &ldquo;Search For Podcast&rdquo; field to search for podcasts.
              </div>
            </li>
            <li>
              <strong>Drag-and-drop episodes onto playlists.</strong>
              <div className="small text-muted">
                After you&apos;ve found the episode you want, just drag it over to the playlist you created and drop it.
              </div>
            </li>
          </ol>
          <hr />
          <p className="mt-4 mb-2 text-center small text-muted">
            <em>
              You can rename, add a description, and reorganize a playlist by clicking on the playlist name in the &ldquo;My Playlists&rdquo;
              section.
            </em>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={acknowledgeInstructions}>
            Start Building
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
