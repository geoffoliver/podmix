type Result = {
  objectID: string;
  name: string;
  image: string;
  description: string;
  author: string;
  genres: string[];
  shows: string[];
  episodes: string[];
  duration: number;
};

type SearchResultParams = {
  hit: Result;
};

const SearchResult = ({ hit }: SearchResultParams) => {
  return <>{hit.name}</>
};

export default SearchResult;
