import { iTunesResult } from "@/lib/external/itunes";

export const PLAYLIST_ENTRY = 'PlaylistEntry';

export type PlaylistEntry = {
  id: string;
  name: string;
  items: iTunesResult[];
};
