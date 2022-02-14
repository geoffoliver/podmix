import { useCallback, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head'
import axios from 'axios';
import Parser from 'rss-parser';

import { Podcast } from '@/lib/types/podcast';
import EpisodesComponent from '@/components/Episodes';
import Podcasts from '@/components/Podcasts';
import Playlists from '@/components/Playlists';

export default function Home() {
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [feed, setFeed] = useState<Parser.Output<any>>(null);

  const getEpisodes = useCallback(async (p: Podcast) => {
    setLoadingFeed(true);
    const resp = await axios.post('/api/get-podcast-episodes', {
      id: p.collectionId,
    });
    setLoadingFeed(false);
    setFeed(resp.data);
  }, []);

  return (
    <>
      <Head>
        <title>Podlists</title>
      </Head>
      <Container>
        <Row>
          <Col md={2}>
            <Playlists />
          </Col>
          <Col>
            <Row>
              <Col md={6}>
                <Podcasts onClick={getEpisodes} />
              </Col>
              <Col md={6}>
                <EpisodesComponent feed={feed} key={feed?.title} loading={loadingFeed} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
