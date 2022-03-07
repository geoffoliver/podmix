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