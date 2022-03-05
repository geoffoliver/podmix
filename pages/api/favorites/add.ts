import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import { Favorite, Playlist, User } from '@/lib/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const user = await User.findByPk(session.user.id);

  if (!user) {
    return res.status(400).json({ error: 'Invalid user' });
  }

  const playlist = await Playlist.findByPk(req.body.playlist);

  if (!playlist) {
    return res.status(400).json({ error: 'Invalid playlist' });
  }

  await Favorite.create({
    playlistId: playlist.id,
    userId: user.id,
  });

  const favorites = await user.getFavorites();

  return res.status(200).json({ favorites })
}
