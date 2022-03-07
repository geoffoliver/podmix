import { Container, Row, Col } from 'react-bootstrap';

import Head from '@/components/Head';

const Terms = () => {
  return (
    <>
      <Head title="Terms of Use" />
      <Container>
        <Row>
          <Col className="pt-4" xl={{ span: 6, offset: 3 }}>
            <h1>Terms Of Use</h1>
            <p>
              The service (&ldquo;Podmix&rdquo;) is provided as-is and offers no warranty or guarantees on service
              availability, reliability, or security.
            </p>
            <p>
              All podcast data is provided by a third party and Podmix will not be held responsible for incorrect information.
            </p>
            <p>
              Podmix may restrict access, disable, or delete an account without notice.
            </p>
            <p>
              Podmix may delete data without notice.
            </p>
            <p>
              There really isn&apos;t much more to it. This is is a free service that lets you make playlists from podcast episodes. Enjoy!
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Terms;
