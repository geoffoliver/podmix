/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import classnames from 'classnames';
import useSWR from 'swr';
import axios, { AxiosResponse } from 'axios';
import clipboard from 'clipboardy';
import { toast } from 'react-toastify';

import { Favorite, Playlist, PlaylistItem, User } from '@/lib/models';

import Icon from '@/components/Icon';
import PlaylistImage from '@/components/PlaylistImage';
import Head from '@/components/Head';
import { secondsToDuration } from '@/lib/util';

import styles from './playlistId.module.scss';
import PlaylistDetailContext from '@/lib/context/playlistDetail';
import SocialTags from '@/components/SocialTags';

const PlaylistPlayer = dynamic(() => import('@/components/PlaylistPlayer'), {
  ssr: false,
});

type PlaylistDetailProps = {
  playlist: Playlist;
  frontendUrl: string;
};

export default function PlaylistDetail({ playlist: playlistProp, frontendUrl }: PlaylistDetailProps) {
  const session = useSession();
  const { data } = useSWR(session.status === 'authenticated' ? '/api/favorites' : null, axios);
  const [favoriting, setFavoriting] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playing, setPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const [forcePlay, setForcePlay] = useState(false);

  useEffect(() => {
    if (data && data.data && data.data.favorites) {
      setFavorites(data.data.favorites);
    } else {
      setFavorites([]);
    }
  }, [data]);

  useEffect(() => {
    setPlaylist(playlistProp);
    setPlaying(false);
    setPlayIndex(0);
    setProgress(0);
  }, [playlistProp]);

  const favPlaylistIds = useMemo(() => {
      return favorites.map((f) => f.playlistId);
  }, [favorites]);

  const isFavorite = useMemo(() => {
    if (!playlist) {
      return false;
    }
    return favPlaylistIds.includes(playlist.id);
  }, [favPlaylistIds, playlist]);

  const toggleFavorite = useCallback(async () => {
    if (!session) {
      return;
    }

    setFavoriting(true);
    try {
      let result: AxiosResponse<{ favorites: Favorite[] }>;

      if (isFavorite) {
        const fav = favorites.find((f) => f.playlistId === playlist.id);
        result = await axios.delete(`/api/favorites/${fav.id}`);
      } else {
        result = await axios.post('/api/favorites/add', { playlist: playlist.id });
      }

      setFavorites(result.data.favorites);
    } catch (ex) {
      toast.error(ex.message || 'There was an error saving the favorite');
    } finally {
      setFavoriting(false);
    }
  }, [session, isFavorite, favorites, playlist]);

  const playItem = useCallback((index) => {
    if (playing && playIndex === index) {
      setPlaying(false);
    } else {
      setForcePlay(true);
      setPlaying(true);
      setPlayIndex(index);
    }
  }, [playIndex, playing]);

  const copy = useCallback((text: string) => {
    const copyText = `${document.location.protocol}//${document.location.host}${text}`;
    clipboard.write(copyText);
    toast.success('Copied!');
  }, []);

  return (
    <>
      <Head title={playlistProp.name}>
        <SocialTags
          title={`${playlistProp.name} - Podmix`}
          description={playlistProp.description}
          image={`${frontendUrl}/api/playlists/image/${playlistProp.id}`}
        />
      </Head>
      <PlaylistDetailContext.Provider value={{
        playlist,
        setPlaylist,
        playing,
        setPlaying,
        playIndex,
        setPlayIndex,
        progress,
        setProgress,
        duration,
        setDuration,
        volume,
        setVolume,
        forcePlay,
        setForcePlay,
      }}>
        <Container className="mt-3">
          <Row>
            <Col>
              <Row>
                <Col md={2}>
                  <PlaylistImage playlist={playlistProp} />
                  <ul className={styles.links}>
                    <li>
                      <Link href={`/api/rss/${playlistProp.id}`}>
                        <a target="_blank" title="Download RSS Feed">
                          <Icon icon="rss" fixedWidth className="me-2" />
                          RSS Feed
                        </a>
                      </Link>
                      <div>
                        <Button
                          variant="link"
                          className="p-0"
                          onClick={() => copy(`/api/rss/${playlistProp.id}`)}
                          title="Copy RSS Feed URL"
                        >
                          <Icon icon="clipboard" />
                        </Button>
                      </div>
                    </li>
                    <li>
                      <Link href={`/api/m3u/${playlistProp.id}`}>
                        <a target="_blank" title="Download Playlist">
                          <Icon icon="file-audio" fixedWidth className="me-2" />
                          MP3 Playlist
                        </a>
                      </Link>
                      <div>
                        <Button
                          variant="link"
                          className="p-0"
                          onClick={() => copy(`/api/m3u/${playlistProp.id}`)}
                          title="Copy Playlist URL"
                        >
                          <Icon icon="clipboard" />
                        </Button>
                      </div>
                    </li>
                  </ul>
                  {session.status === 'authenticated' && (
                    <ul className={styles.links}>
                      <li>
                        <Button variant="link" onClick={toggleFavorite} disabled={favoriting}>
                          <Icon
                            icon={favoriting ? 'spinner' : (isFavorite ? 'heart-crack' : 'heart')}
                            className={classnames('me-2', {[styles.isFavorite]: isFavorite })}
                            spin={favoriting}
                            fixedWidth
                          />
                          {isFavorite ? 'Remove' : 'Add'} Favorite
                        </Button>
                      </li>
                    </ul>
                  )}
                </Col>
                <Col md={10}>
                  <div className={styles.titleAndAuthor}>
                    <h1>{playlistProp.name}</h1>
                    <h6 className={styles.author}>By {playlistProp.user?.name}</h6>
                  </div>
                  {playlistProp.description && <p className={styles.playlistDescription}>{playlistProp.description}</p>}
                  <div className={styles.player}>
                    <PlaylistPlayer />
                  </div>
                  {playlistProp.items.map((item, index) => {
                    const playingItem = (playIndex === index && playing);
                    return (
                      <div
                        key={item.id}
                        className={classnames(
                          styles.item,
                          {
                            [styles.active]: playIndex === index,
                          },
                        )}
                      >
                        <Row>
                          <Col sm={4} md={3} lg={2}>
                            <div className={styles.itemImage}>
                              <img src={item.image} alt={`${item.title} image`} className={styles.image} />
                              <Button
                                variant="dark"
                                onClick={() => playItem(index)}
                                title={playingItem ? 'Pause' : 'Play'}
                              >
                                <Icon icon={playingItem ? 'pause' : 'play'} size="2x" fixedWidth />
                              </Button>
                            </div>
                          </Col>
                          <Col sm={8} md={9} lg={10}>
                            <div className={styles.episodeTitle}>{item.artist} - {item.title}</div>
                            <div className={styles.episodeDescription}>{item.description}</div>
                            <div className={styles.episodeDuration}>{secondsToDuration(item.duration)}</div>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </PlaylistDetailContext.Provider>
    </>
  );
};

/*
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
    order: [['items', 'position', 'ASC']],
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
      frontendUrl: process.env.PUBLIC_URL,
      playlist: asJson,
    },
  };
};
*/

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
      },
    ],
    order: [['items', 'position', 'ASC']],
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
      frontendUrl: process.env.PUBLIC_URL,
    },
  };
};

export async function getStaticPaths() {
  const lists = await Playlist.findAll({
    attributes: ['id'],
  });

  // Get the paths we want to pre-render based on posts
  const paths = lists.map((list) => ({
    params: { playlistId: list.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' };
}
