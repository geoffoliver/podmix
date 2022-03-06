// import { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { GetStaticProps } from 'next';
import Link from 'next/link';

import Head from '@/components/Head';
import SocialTags from '@/components/SocialTags';

import styles from '@/styles/index.module.scss';

type Custom404ErrorProps = {
  frontendUrl: string;
};

export default function Custom404Error({ frontendUrl } : Custom404ErrorProps) {
  return (
    <>
      <Head>
        <SocialTags
          title="Error - Podmix"
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
                <span>404</span>
              </h1>
              <p className="lead">
                <span>Page Not Found</span>
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="lead text-center pt-5">
              We couldn&apos;t find the page you were looking for. Perhaps try going
              to the <Link href="/"><a>home page</a></Link>?
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      frontendUrl: process.env.PUBLIC_URL.toString(),
    },
  };
};
