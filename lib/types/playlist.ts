import { Podcast } from "./podcast";

export const PLAYLIST_ENTRY = 'PlaylistEntry';

export type PlaylistEntry = {
  id: string;
  name: string;
  items: Podcast[];
};
