import axios, { AxiosResponse } from 'axios';

export type iTunesResult = {
	wrapperType: 'track' | 'collection' | 'artistFor';
	kind: 'book' | 'album' | 'coached-audio' | 'feature-movie' | 'interactive-booklet' | 'music-video' | 'pdf' | 'podcast' | 'podcast-episode' | 'software-package' | 'song' | 'tv-episode' | 'artistFor';
  artistId: number;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
  artistViewUrl: string;
  collectionViewUrl: string;
  feedUrl: string;
  trackViewUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  collectionPrice: number;
  trackPrice: number;
  trackRentalPrice: number;
  collectionHdPrice: number;
  trackHdPrice: number;
  trackHdRentalPrice: number;
  releaseDate: string;
  collectionExplicitness: string;
  trackExplicitness: string;
  trackCount: number;
  country: string;
  currency: string;
  primaryGenreName: string;
  contentAdvisoryRating: string;
  artworkUrl600: string;
  genreIds: string[];
  genres: string[];
}

export type iTunesData = {
  resultCount: number;
  results: iTunesResult[];
};

class iTunes {
  baseUrl = 'https://itunes.apple.com/';

  async searchPodcasts(term: string): Promise<iTunesData> {
    const url = `${this.baseUrl}/search?media=podcast&entity=podcast&term=${term}&limit=200`;
    return this.fetch(url);
  }

  async lookupPodcast(id: number): Promise<iTunesData> {
    const url = `${this.baseUrl}/lookup?entity=podcast&id=${id}`;
    return this.fetch(url);
  }

  private async fetch(url: string): Promise<iTunesData> {
    // TODO: cache results
    const result = await axios.get(url);
    return result.data;
  }
}

export default iTunes;
