import type { NextApiRequest, NextApiResponse } from 'next'

import Playlist from '@/lib/models/playlist';
import PlaylistItem from '@/lib/models/playlistItem';
import User from '@/lib/models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.playlistId.toString();

  const playlist = await Playlist.findByPk(id, {
    include: [
      {
        model: PlaylistItem,
        as: 'items',
      },
      {
        model: User,
        as: 'user',
      },
    ],
    order: [['items', 'position', 'ASC']]
  });

  console.log(playlist);

  if (!playlist) {
    return res.status(404).json({ error: 'Invalid playlist' });
  }

  return res.status(200).json({ playlist })
}
