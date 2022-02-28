export type SearchResult = {
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

export type RefinementItem = {
  label: string;
  value: string[];
  count: number;
  isRefined: boolean;
}
