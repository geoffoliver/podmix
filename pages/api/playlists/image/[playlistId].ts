import { NextApiRequest, NextApiResponse } from 'next'

import Playlist from '@/lib/models/playlist';
import PlaylistItem from '@/lib/models/playlistItem';

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

  const image = await playlist.generateImage();

  return res.status(302).redirect(image);
}
