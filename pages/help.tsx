import { signIn } from 'next-auth/react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';

import Head from '@/components/Head';

const Terms = () => {
  return (
    <>
      <Head title="Help" />
      <Container>
        <Row>
          <Col className="py-4" xl={{ span: 6, offset: 3 }}>
            <h1>Help</h1>
            <p className="lead">
              Sometimes (most of the time) computers are stupid and annoying.
            </p>
            <hr className="my-4" />
            <h2>What is this/what is the point?</h2>
            <p>
              Podmix is a service that allows you to create, listen to, and
              share playlists of podcast episodes. <a
              href="https://geoffoliver.me" target="_blank"
              rel="noreferrer">I</a> created Podmix because I wanted a way to
              see all of the &ldquo;<Link
              href="/playlist/7e8bdf73-7eb3-4944-a02d-e88273429f41"><a>Heavy
              Hitters</a></Link>&rdquo; episodes of &rdquo;<a
              href="https://www.lastpodcastontheleft.com/" target="_blank"
              rel="noreferrer">Last Podcast On The Left</a>&rdquo; in a list
              that I could play in VLC or my <a
              href="https://downcast.fm/" target="_blank"
              rel="noreferrer">podcatcher of choice</a>.
            </p>
            <h2 className="mt-5">How do I listen to a playlist?</h2>
            <p>
              To listen to a podcast playlist, use the search field at
              the top of the site to find a playlist, and start listening right in
              your web browser. Alternatively, use the M3U playlist or RSS feeds
              to listen in your favorite player.
            </p>
            <h2 className="mt-5">How do I create a playlist?</h2>
            <p>
              You will need to create an account and login to create your own playlists.
              Creating an account will also allow you to &ldquo;Favorite&rdquo; playlists.
              list. For details about the data we collect and store, check out
              the <Link href="/privacy"><a>Privacy Policy</a></Link> page.
            </p>
            <h2 className="mt-5">What do I do with the M3U playlist?</h2>
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
              An account allows you to create your own playlists and to
              &ldquo;favorite&rdquo; other playlists.  For details about the
              data we collect and store, check out the <Link
              href="/privacy"><a>Privacy Policy</a></Link> page.
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
            <h2 className="mt-5">How does it work?</h2>
            <p>
              All the podcasts you find on Podmix can also be found on Apple
              Podcasts. That is because Podmix uses the <a
              href="https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/"
              target="_blank" rel="noreferrer">iTunes Search API</a> to let users
              search for podcast shows and episodes to make playlists.
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Terms;
