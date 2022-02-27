import { Row, Col } from 'react-bootstrap';

import { SearchResult } from '@/lib/types/search';
import SearchResultComponent from './SearchResult';

type SearchResultsParams = {
  hits: SearchResult[],
};

const SearchResults = ({ hits }: SearchResultsParams) => {
  return (
    <Row>
      {hits.map((hit) => (
        <Col key={hit.objectID}>
          <SearchResultComponent hit={hit} />
        </Col>
      ))}
    </Row>
  )
};

export default SearchResults;
