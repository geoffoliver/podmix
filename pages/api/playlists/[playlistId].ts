import type { NextApiRequest, NextApiResponse } from 'next'

import Playlist from '@/lib/models/playlist';
import PlaylistItem from '@/lib/models/playlistItem';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.playlistId.toString();

  const playlist = await Playlist.findByPk(id, {
    include: [
      {
        model: PlaylistItem,
        as: 'items',
      },
    ],
    order: [['items', 'position', 'ASC']]
  });

  if (!playlist) {
    return res.status(404).json({ error: 'Invalid playlist' });
  }

  return res.status(200).json({ playlist })
}
