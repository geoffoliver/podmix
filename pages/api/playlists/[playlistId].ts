import type { NextApiRequest, NextApiResponse } from 'next'

import { Playlist, PlaylistItem, User } from '@/lib/models';

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

  if (!playlist) {
    return res.status(404).json({ error: 'Invalid playlist' });
  }

  return res.status(200).json({ playlist })
}
