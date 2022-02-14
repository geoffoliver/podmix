import { Podcast } from "./podcast";

export type PlaylistEntry = {
  id: string;
  name: string;
  items: Podcast[];
};
