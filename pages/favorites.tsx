import { useCallback, useEffect, useState } from 'react';
import { Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import Head from 'next/head'
import useSWR, { useSWRConfig } from 'swr';
import axios from 'axios';

import { Favorite } from '@/lib/models';
import Icon from '@/components/Icon';
import PlaylistSummary from '@/components/PlaylistSummary';

import styles from '@/styles/favorites.module.scss';
import { toast } from 'react-toastify';

export default function Favorites() {
  useSession({
    required: true,
  });

  const { data, error, isValidating } = useSWR('/api/favorites', axios);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (data && data.data && data.data.favorites) {
      setFavorites(data.data.favorites);
    } else {
      setFavorites([]);
    }
  }, [data])

  const removeFavorite = useCallback(async (fav: Favorite) => {
    const doRemove = window.confirm(`Are you sure you want to remove the favorite "${fav.playlist.name}?"`);
    if (!doRemove) {
      return;
    }

    const original = JSON.parse(JSON.stringify(favorites));

    try {
      mutate('/api/favorites', { data: { favorites: favorites.filter((f) => f !== fav) } }, false);
      await axios.delete(`/api/favorites/${fav.id}`);
    } catch (ex) {
      toast.error(ex.mesage || 'Error removing favorite');
      mutate('/api/favorites', original, false);
    }
  }, [favorites, mutate]);

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
            {!isValidating && favorites.length === 0 && (
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
                    <div className={styles.favorite}>
                      <PlaylistSummary playlist={favorite.playlist} />
                      <div className={styles.removeButton}>
                        <Button variant="link" size="sm" onClick={() => removeFavorite(favorite)}>
                          <Icon icon="trash-alt" className="me-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
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
