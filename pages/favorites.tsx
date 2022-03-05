import { useEffect, useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import Head from 'next/head'
import useSWR from 'swr';
import axios from 'axios';

import { Favorite } from '@/lib/models';
import Icon from '@/components/Icon';
import PlaylistSummary from '@/components/PlaylistSummary';

// import Playlists from '@/components/Playlists';
// import PodcastBrowser from '@/components/PodcastBrowser';
// import PlaylistEditor from '@/components/PlaylistEditor';
// import PodcastsContext from '@/lib/context/podcasts';
// import { iTunesResult } from '@/lib/external/itunes';

// import styles from '@/styles/favorites.module.scss';

export default function Favorites() {
  const sess = useSession({
    required: true,
  });

  const { data, error, isValidating } = useSWR('/api/favorites', axios);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    console.log(data);
    if (data && data.data && data.data.favorites) {
      setFavorites(data.data.favorites);
    } else {
      setFavorites([]);
    }
  }, [data])

  return (
    <>
      <Head>
        <title>Podmix - Favorites</title>
      </Head>
      <Container className="my-3">
        <Row>
          <Col>
            <h1>Favorites</h1>
            <hr />
            {error && (
              <div>
                <h4>Error</h4>
                <pre>{JSON.stringify(error, null, 2)}</pre>
              </div>
            )}
            {isValidating && favorites.length === 0 && <Icon icon="spinner" spin fixedWidth />}
            {favorites.length === 0 && (
              <Alert variant="info">
                <Alert.Heading>No Favorites</Alert.Heading>
                <p className="mb-0">
                  You do not have any favorites.
                </p>
              </Alert>
            )}
            {favorites.length > 0 && (
              <Row>
                {favorites.map((favorite) => (
                  <Col key={favorite.id} xs={6} sm={4} md={3} lg={2}>
                    <PlaylistSummary playlist={favorite.playlist} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
