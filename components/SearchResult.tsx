
import { SearchResult } from '@/lib/types/search';

type SearchResultParams = {
  hit: SearchResult;
};

const SearchResultComponent = ({ hit }: SearchResultParams) => {
  return <>{hit.name}</>
};

export default SearchResultComponent;
