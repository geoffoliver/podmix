import { signIn } from 'next-auth/react';
import { Container, Row, Col } from 'react-bootstrap';

import Head from '@/components/Head';

const Terms = () => {
  return (
    <>
      <Head title="Help" />
      <Container>
        <Row>
          <Col className="pt-4" xl={{ span: 6, offset: 3 }}>
            <h1>Help</h1>
            <p className="lead">
              Sometimes (most of the time) computers are stupid and annoying.
            </p>
            <hr className="my-4" />
            <h2>What do I do with the M3U playlist?</h2>
            <p>
              Are you on a Mac or an iOS device? We&apos;ve got some bad news
              for you. It seems that Apple Music, iTunes, or whatever is incapable
              of properly playing the M3U files we offer. Unfortunately, the
              only way around this is to download a player that <em>does</em> support
              M3U playlists. We suggest <a
              href="https://www.videolan.org" target="_blank"
              rel="noreferrer">VLC</a>.
            </p>
            <p>
              If you&apos;re on Windows, you should be able to use VLC or even Windows
              Media Player.
            </p>
            <h2 className="mt-5">What do I do with the RSS feed?</h2>
            <p>
              Put it into a podcatcher (Apple Podcasts, Google Podcasts,
              Downcast, Overcast, etc.) on your phone or your computer and enjoy
              listening!
            </p>
            <h2 className="mt-5">Why should I create an account?</h2>
            <p>
              An account allows you to create your own playlists and to &ldquo;favorite&rdquo; other playlists.
            </p>
            <h2 className="mt-5">How do I create an account?</h2>
            <p>
              Go to the <a href="#" onClick={(e) => { e.preventDefault();
              signIn(); }}>login/register page</a> and enter your email address
              or use your Facebook or Google account. If you choose to login with
              an email address, you won&apos;t need to enter a password - we
              will send a link to the email address you provide with a link to
              login.
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Terms;
