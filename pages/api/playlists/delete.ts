import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { Playlist } from '@/lib/models';
import cache from '@/lib/cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const playlist = await Playlist.findOne({
    where: {
      userId: session.user.id,
      id: req.body.id,
    },
  });

  if (!playlist) {
    return res.status(404).json({ error: 'Invalid playlist' });
  }

  await playlist.destroy();

  const rssCache = `playlist-rss-${playlist.id}`;
  const m3uCache = `playlist-m3u-${playlist.id}`;

  await cache.deleteCache(rssCache, m3uCache);

  return res.status(200).json({ playlist });
}
