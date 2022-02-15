/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import { GetServerSideProps, GetStaticProps } from 'next';

import Playlist from '@/lib/models/playlist';
import PlaylistItem from '@/lib/models/playlistItem';

import styles from './playlistId.module.scss';
import Icon from '@/components/Icon';

type PlaylistDetailProps = {
  playlist: Playlist;
};

export default function PlaylistDetail({ playlist }: PlaylistDetailProps) {
  if (!playlist) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{playlist.name} - Podlists</title>
      </Head>
      <Container className="mt-3">
        <Row>
          <Col>
            <div className={styles.title}>
              <h1>{playlist.name}</h1>
            </div>
            {playlist.description && <p>{playlist.description}</p>}
            <ul className={styles.links}>
              <li>
                <Link href={`/api/rss/${playlist.id}`}>
                  <a target="_blank">
                    <Icon icon="rss" fixedWidth className="me-2" />
                    RSS Feed
                  </a>
                </Link>
              </li>
              <li>
                <Link href={`/api/m3u/${playlist.id}`}>
                  <a target="_blank">
                    <Icon icon="file-audio" fixedWidth className="me-2" />
                    MP3 Playlist
                  </a>
                </Link>
              </li>
            </ul>
            <div className={styles.playlistItems}>
              {playlist.items.map((item) => {
                return (
                  <Row key={item.id}>
                    <Col sm={1}>
                      <img src={item.image} alt={`${item.title} image`} className="img-fluid" width="100" />
                    </Col>
                    <Col sm={11}>
                      <div className={styles.episodeTitle}>{item.title}</div>
                      <div className={styles.description}>{item.description}</div>
                      <div className={styles.duration}>{item.duration}</div>
                    </Col>
                  </Row>
                );
              })}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const playlist = await Playlist.findByPk(params.playlistId.toString(), {
    include: [
      {
        model: PlaylistItem,
        as: 'items',
      }
    ],
    order: [['items', 'position', 'ASC']]
  });

  // not sure why we need to stringify and parse this, but if
  // we don't, then next will complain that we're trying to pass
  // something in that can't be serialized in JSON (dates), but
  // this seems to work just fine, so :shrug:
  // specific error:
  // Error serializing `.playlist.createdAt` returned from `getStaticProps` in "/playlist/[playlistId]".
  // Reason: `object` ("[object Date]") cannot be serialized as JSON. Please only return JSON serializable data types.
  const asJson = JSON.parse(JSON.stringify(playlist.toJSON()));

  return {
    revalidate: 300,
    props: {
      playlist: asJson,
    },
  };
}

export async function getStaticPaths() {
  const lists = await Playlist.findAll({
    attributes: ['id'],
  });

  // Get the paths we want to pre-render based on posts
  const paths = lists.map((list) => ({
    params: { playlistId: list.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}
