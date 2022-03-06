import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { Playlist } from '@/lib/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const playlist = await Playlist.create({
    name: req.body.name,
    userId: session.user.id,
  });

  // await searchIndex.saveObject({
  //   objectID: playlist.id,
  //   name: playlist.name,
  //   genres: [],
  //   shows: [],
  //   duration: 0,
  // });

  return res.status(200).json({ playlist });
}
