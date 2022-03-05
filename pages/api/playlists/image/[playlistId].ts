import { NextApiRequest, NextApiResponse } from 'next'

import { Playlist } from '@/lib/models';
import GenerateImage from '@/pages/api/playlists/generate-image';

const GENERIC_PLAYLIST_ICON = '/generic-playlist-icon.png';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.playlistId.toString();

  const playlist = await Playlist.findByPk(id, {
    attributes: ['id', 'image'],
  });

  if (!playlist) {
    return res.status(404).json({ error: 'Invalid playlist' });
  }

  if (playlist.image) {
    return res.status(302).redirect(playlist.image);
  }

  await GenerateImage.enqueue({
    playlistId: playlist.id,
  });

  return res.status(302).redirect(GENERIC_PLAYLIST_ICON);
}
