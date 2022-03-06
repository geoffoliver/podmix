import { SearchResult } from '@/lib/types/search';
import styles from '@/styles/SearchResults.module.scss';
import { Pagination } from 'react-bootstrap';

import SearchResultComponent from './SearchResult';

type SearchResultsParams = {
  hits: SearchResult[],
};

const SearchResults = ({ hits }: SearchResultsParams) => {
  return (
    <div className={styles.searchResults}>
      <div>
        {hits.map((hit) => (
          <SearchResultComponent key={hit.objectID} hit={hit} />
        ))}
      </div>
      <Pagination />
    </div>
  );
};

export default SearchResults;
