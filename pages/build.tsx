import { useCallback, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Playlists from '@/components/Playlists';
import PodcastBrowser from '@/components/PodcastBrowser';
import PlaylistEditor from '@/components/PlaylistEditor';
import Playlist from '@/lib/models/playlist';
import PodcastsContext from '@/lib/context/podcasts';
import { Podcast } from '@/lib/types/podcast';

export default function Home() {
  const [showEdit, setShowEdit] = useState(false);
  const [playlist, setPlaylist] = useState<Playlist>(null);
  const [podcast, setLocalPodcast] = useState<Podcast>(null);

  const editPlaylist = useCallback((list) => {
    setPlaylist(list);
    setShowEdit(true);
  }, []);

  const setPodcast = useCallback((p: Podcast) => {
    setLocalPodcast(p);
  }, []);

  return (
    <>
      <Head>
        <title>Podlists</title>
      </Head>
      <DndProvider backend={HTML5Backend}>
        <PodcastsContext.Provider value={{ podcast, setPodcast }}>
          <Container className="mt-3" fluid>
            <Row>
              <Col md={2}>
                <Playlists onEdit={editPlaylist} />
              </Col>
              <Col md={10}>
                <PodcastBrowser />
              </Col>
            </Row>
          </Container>
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
    </>
  );
}
