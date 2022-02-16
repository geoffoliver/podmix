import axios, { AxiosResponse } from axios;

type iTunesResult = {
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

class iTunes {
  baseUrl = 'https://itunes.apple.com/';

  async searchPodcasts(term: string): Promise<any> {
    const url = `${this.baseUrl}/search?entity=podcast&term=${term}`;
    return this.fetch(url);
  }

  async lookupPodcast(id: number): Promise<any> {
    const url = `${this.baseUrl}/lookup?id=${id}&entity=podcast`;
    return this.fetch(url);
  }

  private async fetch(url: string): Promise<any> {
    const result = await axios.get(url);
    return result.data;
  }
}

export default iTunes;
