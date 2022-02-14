import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import Playlist from '@/lib/models/playlist';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  const totalItems = await playlist.countItems();

  const item = await playlist.createItem({
    mediaUrl: req.body.mediaUrl,
    link: req.body.link,
    title: req.body.title,
    pubDate: req.body.pubDate,
    collectionId: req.body.collectionId,
    collectionName: req.body.collectionName,
    artistName: req.body.artistName,
    image: req.body.image,
    description: req.body.description,
    duration: req.body.duration,
    position: req.body.position || totalItems
  });

  return res.status(200).json({ item })
}
