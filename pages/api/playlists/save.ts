import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import Playlist from '@/lib/models/playlist';
import PlaylistItem from '@/lib/models/playlistItem';

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

  playlist.set({
    name: req.body.name,
    description: req.body.description,
  });

  await playlist.save();

  if (req.body.removed) {
    await PlaylistItem.destroy({
      where: {
        id: req.body.removed.map((i: PlaylistItem) => i.id)
      },
    });
  }

  const items = PlaylistItem.bulkBuild(req.body.items, { isNewRecord: false });
  items.forEach((item, i) => {
    item.set('position', i);
  });
  await Promise.allSettled(items.map((i) => i.save()));

  return res.status(200).json({ playlist })
}
