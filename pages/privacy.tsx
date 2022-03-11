import { Container, Row, Col } from 'react-bootstrap';

import Head from '@/components/Head';

const Privacy = () => {
  return (
    <>
      <Head title="Privacy Policy" />
      <Container>
        <Row>
          <Col className="pt-4" xl={{ span: 6, offset: 3 }}>
            <h1>Privacy Policy</h1>
            <p>
              We respect your privacy. We don&apos;t sell your data, and we don&apos;t track you with ads or other sketchy
              stuff. We only store your profile information, your favorites, and your playlists, because that&apos;s all
              we need!
            </p>
            <hr />
            <h3>Cookies</h3>
            <p>
              We will store a cookie on your computer for authentication purposes.
            </p>
            <h3>Data we store</h3>
            <p>
              Whether logging in with an email address, a Google account, or a Facebook account, we will only store
              three pieces of personal information:
            </p>
            <ul>
              <li>Your name</li>
              <li>Your email address</li>
              <li>Your profile picture</li>
            </ul>
            <p>
              If you login with a Google or Facebook account, the details above are obtained during your initial login,
              but they can be changed at any time by editing your profile.
            </p>
            <p>
              In addition to the personal data listed above, we also store your playlists and list of favorites.
            </p>
            <h3>Deleting your data</h3>
            <p>
              If you want to delete your data from Podmix, just send an email to <a href="mailto:data@podmix.me">data@podmix.me</a>.
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Privacy;
