/* eslint-disable @next/next/no-img-element */
import { useCallback, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import { GetServerSideProps, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import classnames from 'classnames';

import { Playlist, PlaylistItem, User } from '@/lib/models';

import Icon from '@/components/Icon';
import PlaylistImage from '@/components/PlaylistImage';
import { secondsToDuration } from '@/lib/util';

import styles from './playlistId.module.scss';

const PlaylistPlayer = dynamic(() => import('@/components/PlaylistPlayer'), {
  ssr: false,
});

type PlaylistDetailProps = {
  playlist: Playlist;
};

export default function PlaylistDetail({ playlist }: PlaylistDetailProps) {
  const [playing, setPlaying] = useState(null);
  const [play, setPlay] = useState(0);

  if (!playlist) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{playlist.name} - Podmix</title>
      </Head>
      <Container className="mt-3">
        <Row>
          <Col>
            <Row>
              <Col md={2}>
                <PlaylistImage playlist={playlist} />
              </Col>
              <Col md={10}>
                <div>
                  <h1>{playlist.name}</h1>
                  <h6 className={styles.author}>By {playlist.user?.name}</h6>
                </div>
                {playlist.description && <p className={styles.description}>{playlist.description}</p>}
                <div className={styles.player}>
                  <PlaylistPlayer
                    playlist={playlist}
                    onPlay={(item) => setPlaying(item)}
                    play={play}
                  />
                </div>
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
                {playlist.items.map((item, index) => {
                  return (
                    <button
                      key={item.id}
                      className={classnames(
                        styles.item,
                        {
                          [styles.active]: item === playing,
                        },
                      )}
                      onClick={() => setPlay(index)}
                    >
                      <Row>
                        <Col sm={2}>
                          <img src={item.image} alt={`${item.title} image`} className={styles.image} />
                        </Col>
                        <Col sm={10}>
                          <div className={styles.episodeTitle}>{item.title}</div>
                          <div className={styles.description}>{item.description}</div>
                          <div className={styles.duration}>{secondsToDuration(item.duration)}</div>
                        </Col>
                      </Row>
                    </button>
                  );
                })}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const playlist = await Playlist.findByPk(params.playlistId.toString(), {
    include: [
      {
        model: PlaylistItem,
        as: 'items',
      },
      {
        model: User,
        as: 'user',
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
    props: {
      playlist: asJson,
    },
  };
}
/*
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const playlist = await Playlist.findByPk(params.playlistId.toString(), {
    include: [
      {
        model: PlaylistItem,
        as: 'items',
      },
      {
        model: User,
        as: 'user',
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
*/
