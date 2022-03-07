import { Container, Row, Col } from 'react-bootstrap';

const Terms = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Terms Of Use</h1>
          <p>
            The service &ldquo;Podmix&rdquo; is provided as-is and offers no warranty or guarantees on service
            availability, reliability, or security.
          </p>
          <p>
            All Podcast data is provided by a third party and Podmix will not be held responsible for incorrect information.
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
  );
};

export default Terms;
