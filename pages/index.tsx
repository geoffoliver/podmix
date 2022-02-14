import Playlist from '@/lib/models/playlist';
import Head from 'next/head'
import Link from 'next/link';
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
      <Link href='/build'>
        Build playlist
      </Link>
      {isValidating && !playlists && <div>Loading...</div>}
      {error && <div>{JSON.stringify(error)}</div>}
      {playlists.map((p) => {
        return (
          <>
            <h5>{p.name}</h5>
          </>
        )
      })}
    </>
  );
}
