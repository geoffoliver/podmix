import { useCallback, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Parser from 'rss-parser';

import { Podcast } from '@/lib/types/podcast';
import EpisodesComponent from '@/components/Episodes';
import Podcasts from '@/components/Podcasts';

const PodcastBrowser = () => {
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
    <Row>
      <Col md={6}>
        <Podcasts onClick={getEpisodes} />
      </Col>
      <Col md={6}>
        <EpisodesComponent feed={feed} key={feed?.title} loading={loadingFeed} />
      </Col>
    </Row>
  );
};

export default PodcastBrowser;
