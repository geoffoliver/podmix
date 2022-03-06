import { useCallback, useContext, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Parser from 'rss-parser';
import { toast } from 'react-toastify';

import EpisodesComponent from '@/components/Episodes';
import Podcasts from '@/components/Podcasts';
import PodcastsContext from '@/lib/context/podcasts';
import { iTunesResult } from '@/lib/external/itunes';

const PodcastBrowser = () => {
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [feed, setFeed] = useState<Parser.Output<any>>(null);
  const context = useContext(PodcastsContext);

  const getEpisodes = useCallback(async (p: iTunesResult) => {
    context.setPodcast(p);
    setLoadingFeed(true);
    try {
      const resp = await axios.post('/api/get-podcast-episodes', {
        id: p.collectionId,
      });
      setFeed(resp.data);
    } catch (ex) {
      toast.error(ex.response?.data?.error || 'Error getting episodes');
    } finally {
      setLoadingFeed(false);
    }
  }, [context]);

  return (
    <Row>
      <Col md={(feed || loadingFeed) ? 5 : 12}>
        <Podcasts onClick={getEpisodes} />
      </Col>
      {(loadingFeed || feed) && (
        <Col md={7}>
          <EpisodesComponent
            feed={feed}
            key={feed?.title}
            loading={loadingFeed}
          />
        </Col>
      )}
    </Row>
  );
};

export default PodcastBrowser;
