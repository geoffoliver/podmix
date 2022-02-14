import { useCallback, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Playlists from '@/components/Playlists';
import PodcastBrowser from '@/components/PodcastBrowser';
import PlaylistEditor from '@/components/PlaylistEditor';
import Playlist from '@/lib/models/playlist';

export default function Home() {
  const [mainView, setMainView] = useState('browser');
  const [playlist, setPlaylist] = useState<Playlist>(null);

  const editPlaylist = useCallback((list) => {
    setPlaylist(list);
    setMainView('edit');
  }, []);

  return (
    <>
      <Head>
        <title>Podlists</title>
      </Head>
      <DndProvider backend={HTML5Backend}>
        <Container>
          <Row>
            <Col md={2}>
              <Playlists onEdit={editPlaylist} />
            </Col>
            <Col md={10}>
              {mainView === 'browser'
                ? <PodcastBrowser />
                : (
                  <>
                    <div>
                      <button onClick={() => setMainView('browser')}>Back</button>
                    </div>
                    <PlaylistEditor playlist={playlist} />
                  </>
                )
              }
            </Col>
          </Row>
        </Container>
      </DndProvider>
    </>
  );
}
