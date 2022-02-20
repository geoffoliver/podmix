import { useCallback, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Playlists from '@/components/Playlists';
import PodcastBrowser from '@/components/PodcastBrowser';
import PlaylistEditor from '@/components/PlaylistEditor';
import Playlist from '@/lib/models/playlist';
import PodcastsContext from '@/lib/context/podcasts';
import { getSession, signIn } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { iTunesResult } from '@/lib/external/itunes';

import styles from '@/styles/build.module.scss';

export default function Build({ loggedIn }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [showEdit, setShowEdit] = useState(false);
  const [playlist, setPlaylist] = useState<Playlist>(null);
  const [podcast, setLocalPodcast] = useState<iTunesResult>(null);

  const editPlaylist = useCallback((list) => {
    setPlaylist(list);
    setShowEdit(true);
  }, []);

  const setPodcast = useCallback((p: iTunesResult) => {
    setLocalPodcast(p);
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      signIn();
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return null;
  }

  /*
  if (!loggedIn) {
    return (
      <>
        <Head>
          <title>Login Required - Podlists</title>
        </Head>
        <Container>
          <Row>
            <Col>
              <h1>You must login to access this feature.</h1>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
  */
  return (
    <>
      <Head>
        <title>Podlists</title>
      </Head>
      <DndProvider backend={HTML5Backend}>
        <PodcastsContext.Provider value={{ podcast, setPodcast }}>
          <div className={styles.playlistBuilder}>
            <Container>
              <Row>
                <Col md={3} xl={2}>
                  <Playlists onEdit={editPlaylist} />
                </Col>
                <Col md={9} xl={10}>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      loggedIn: !!session,
    },
  };
};
