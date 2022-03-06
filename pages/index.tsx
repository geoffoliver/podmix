// import { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { GetServerSideProps } from 'next';
// import useSWR from 'swr';
// import axios from 'axios';

import { Playlist, PlaylistItem, User } from '@/lib/models';
import PlaylistSummary from '@/components/PlaylistSummary';
import Head from '@/components/Head';

import styles from '@/styles/index.module.scss';
import SocialTags from '@/components/SocialTags';
import { WhereOptions } from 'sequelize/types';

type HomeProps = {
  playlists: Playlist[];
  frontendUrl: string;
};

export default function Home({ playlists, frontendUrl }: HomeProps) {
  console.log(frontendUrl);
  return (
    <>
      <Head>
        <SocialTags
          title="Podmix"
          description="Create, share, and listen to podcast playlists"
          type="website"
          image={`${frontendUrl}/hero.jpg`}
        />
      </Head>
      <Container>
        <Row>
          <Col>
            <div className={styles.hero}>
              <h1>
                <span>Podmix</span>
              </h1>
              <p className="lead">
                <span>Create &amp; share podcast playlists</span>
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {playlists.length > 0 && (
              <>
                <h5>Newest Playlists</h5>
                <hr />
                <Row>
                {playlists.map((p) => (
                  <Col key={p.id} xs={6} sm={4} md={3} lg={2}>
                    <PlaylistSummary playlist={p} />
                  </Col>
                ))}
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const limit = 30;
  let where: WhereOptions<Playlist> = undefined;
  let offset = 0;


  if (query && query.page) {
    let pageNum = Number(query.page);
    if (pageNum > 0) {
      offset = (pageNum - 1) * limit;
    }
  }

  const playlists = await Playlist.findAll({
    where,
    limit,
    offset,
    include: [
      {
        model: User,
        as: 'user',
      },
      {
        model: PlaylistItem,
        as: 'items',
        required: true,
        attributes: [],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  // not sure why we need to stringify and parse this, but if
  // we don't, then next will complain that we're trying to pass
  // something in that can't be serialized in JSON (dates), but
  // this seems to work just fine, so :shrug:
  // specific error:
  // Error serializing `.playlist.createdAt` returned from `getStaticProps` in "/playlist/[playlistId]".
  // Reason: `object` ("[object Date]") cannot be serialized as JSON. Please only return JSON serializable data types.
  const asJson = JSON.parse(JSON.stringify(playlists));

  return {
    props: {
      playlists: asJson,
      frontendUrl: process.env.PUBLIC_URL.toString(),
    },
  };
};
