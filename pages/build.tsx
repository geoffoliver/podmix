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
import { Podcast } from '@/lib/types/podcast';
import { getSession, signIn } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

export default function Build({ loggedIn }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
          <Container className="mt-3">
            <Row>
              <Col md={3}>
                <Playlists onEdit={editPlaylist} />
              </Col>
              <Col md={9}>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      loggedIn: !!session,
    },
  };
};
