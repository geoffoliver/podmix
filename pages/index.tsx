import Playlist from '@/lib/models/playlist';
import Head from 'next/head'
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import useSWR from 'swr';
import axios from 'axios';

export default function Home() {
  const { data, error, isValidating } = useSWR('/api/playlists', axios);

  const playlists: Playlist[] = data ? data.data.playlists : [];

  // console.log(data, error, isValidating);

  return (
    <>
      <Head>
        <title>Podlists</title>
      </Head>
      <Container className="mt-3">
        <Row>
          <Col>
            <Link href='/build'>
              Build playlist
            </Link>
            {isValidating && !playlists && <div>Loading...</div>}
            {error && <div>{JSON.stringify(error)}</div>}
            {playlists.map((p) => {
              return (
                <div key={p.id}>
                  <h5>
                    <Link href={`/playlist/${p.id}`}>
                      <a>
                        {p.name}
                      </a>
                    </Link>
                  </h5>
                  <p>{p.description}</p>
                </div>
              )
            })}
          </Col>
        </Row>
      </Container>
    </>
  );
}
