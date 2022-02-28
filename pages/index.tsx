import { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head'
import useSWR from 'swr';
import axios from 'axios';

import { Playlist } from '@/lib/models';
import PlaylistSummary from '@/components/PlaylistSummary';

import styles from '@/styles/index.module.scss';

export default function Home() {
  const { data, error, isValidating } = useSWR('/api/playlists', axios, {
    revalidateOnFocus: false,
  });

  const playlists = useMemo<Playlist[]>(() => {
    return data ? data.data.playlists : [];
  }, [data]);

  return (
    <>
      <Head>
        <title>Podmix</title>
      </Head>
      <Container>
        <Row>
          <Col>
            <div className={styles.hero}>
              <h1>
                <span>Podmix</span>
              </h1>
              <p className="lead">
                <span>Create &amp; share podcast playlists</span>
              </p>
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
