import { useCallback, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
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
  useSession({
    required: true,
  });

  const editPlaylist = useCallback((list) => {
    setPlaylist(list);
    setShowEdit(true);
  }, []);

  const setPodcast = useCallback((p: iTunesResult) => {
    setLocalPodcast(p);
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
    </>
  );
}
