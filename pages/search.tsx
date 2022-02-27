import { Container, Row, Col } from 'react-bootstrap';
import { connectHits, Hits } from 'react-instantsearch-dom';
import Head from 'next/head'

// import Playlist from '@/lib/models/playlist';
// import PlaylistSummary from '@/components/PlaylistSummary';
import SearchResults from '@/components/SearchResults';

const CustomHits = connectHits(SearchResults);

// import styles from '@/styles/index.module.scss';

export default function Home() {
  // const { data: session } = useSession();
  // const { data, error, isValidating } = useSWR('/api/playlists', axios, {
  //   revalidateOnFocus: false,
  // });

  // const playlists = useMemo<Playlist[]>(() => {
  //   return data ? data.data.playlists : [];
  // }, [data]);

  return (
    <>
      <Head>
        <title>Podmix - Search</title>
      </Head>
      <Container>
        <Row>
          <Col>
            <CustomHits />
          </Col>
        </Row>
      </Container>
    </>
  );
}
