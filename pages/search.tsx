import { Container, Row, Col } from 'react-bootstrap';
import { connectHits, connectRefinementList, connectStateResults } from 'react-instantsearch-dom';
import Head from 'next/head'

import SearchResults from '@/components/SearchResults';
import Refinements from '@/components/Refinements';

const CustomHits = connectHits(SearchResults);
const CustomRefinements = connectRefinementList(Refinements);

import styles from '@/styles/search.module.scss';
import Icon from '@/components/Icon';
import { GetServerSideProps } from 'next';

type ResultsProps = {
  searchState: any;
  searchResults: any;
  allSearchResults: any;
  error: any;
  searching: boolean;
  searchingForFacetValues: boolean;
  isSearchStalled: boolean;
};

const Searching = () => (
  <div className={styles.loading}>
    <Icon icon="spinner" spin fixedWidth />
    Searching...
  </div>
);

const Results = ({ searching, allSearchResults, searchState }: ResultsProps) => {
  return (
    <Container>
      {(!allSearchResults || allSearchResults.nbHits === 0) && (
        <Row>
          <Col>
            {searching ? (
              <Searching />
            ) : (
              <div className={styles.noResults}>
                No results found for &ldquo;{searchState.query}&rdquo;
              </div>
            )}
          </Col>
        </Row>
      )}
      {allSearchResults && allSearchResults.nbHits > 0 && (
        <Row>
          <Col md={3} className="pt-3">
            <div className={styles.refinement}>
              <h2>Genres</h2>
              <div className={styles.refinements}>
                <CustomRefinements attribute="genres" />
              </div>
            </div>
            <div className={styles.refinement}>
              <h2>Shows</h2>
              <div className={styles.refinements}>
                <CustomRefinements attribute="shows" />
              </div>
            </div>
          </Col>
          <Col md={9}>
            <CustomHits />
          </Col>
        </Row>
      )}
    </Container>
  );
};

const ConnectedResults = connectStateResults(Results);

const Search = () => {
  return (
    <>
      <Head>
        <title>Podmix - Search</title>
      </Head>
      <ConnectedResults />
    </>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps = async (_context) => {
  // do this only so we can get the query on the server side and populate the
  // search box so react doesn't complain that the server and client don't match
  return {
    props: {},
  };
};
