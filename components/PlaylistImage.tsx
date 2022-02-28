/* eslint-disable @next/next/no-img-element */

import Playlist from '@/lib/models/playlist';

type PlaylistImageProps = {
  playlist: Playlist;
};

const PlaylistImage = ({ playlist }: PlaylistImageProps) => {
  return (
    <img
      src={`/api/playlists/image/${playlist.id}`}
      alt={`Image for ${playlist.name}`}
      className="img-fluid"
    />
  );
};

export default PlaylistImage;
