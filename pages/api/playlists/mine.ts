import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import Playlist from '@/lib/models/playlist';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const playlists = await Playlist.findAll({
    where: {
      userId: session.user.id,
    },
    order: [['createdAt', 'DESC']]
  });

  return res.status(200).json({ playlists })
}
