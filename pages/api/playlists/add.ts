import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import Playlist from '@/lib/models/playlist';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const playlist = await Playlist.create({
    name: req.body.name,
    userId: session.user.id,
  });

  return res.status(200).json({ playlist })
}
