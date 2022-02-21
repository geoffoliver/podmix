import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Row, Col } from 'react-bootstrap';
import Playlist from '@/lib/models/playlist';
import Head from 'next/head'
import useSWR from 'swr';
import axios from 'axios';

import PlaylistSummary from '@/components/PlaylistSummary';

import styles from '@/styles/index.module.scss';

export default function Home() {
  const { data: session } = useSession();
  const { data, error, isValidating } = useSWR('/api/playlists', axios, {
    revalidateOnFocus: false,
  });

  const playlists = useMemo<Playlist[]>(() => {
    return data ? data.data.playlists : [];
  }, [data]);

  return (
    <>
      <Head>
        <title>Podlists</title>
      </Head>
      <Container>
        <Row>
          <Col>
            <div className={styles.hero}>
              <div className="my-5 p-4">
                <h1>Podcast Playlists for Everyone</h1>
                <p className="lead">Create, listen to, and share podcast playlists!</p>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {isValidating && !playlists && <div>Loading...</div>}
            {error && <div>{JSON.stringify(error)}</div>}
            <h5>Newest Playlists</h5>
            <hr />
            <Row>
            {playlists.map((p) => (
              <Col key={p.id} xs={6} sm={4} md={3} lg={2}>
                <PlaylistSummary playlist={p} />
              </Col>
            ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
