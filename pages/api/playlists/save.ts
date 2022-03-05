import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import { Playlist, PlaylistItem } from '@/lib/models';
import Bunny from '@/lib/external/bunny';
import cache from '@/lib/cache';
import GenerateImage from '@/pages/api/playlists/generate-image';

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

  playlist.set({
    name: req.body.name,
    description: req.body.description,
  });

  if (req.body.removed) {
    await PlaylistItem.destroy({
      where: {
        id: req.body.removed.map((i: PlaylistItem) => i.id)
      },
    });
  }

  const saveItems = req.body.items;

  saveItems.forEach((item: any, i: number) => {
    item.position = i;
  });

  await PlaylistItem.bulkCreate(saveItems, {
    updateOnDuplicate: ['position'],
  });

  if (playlist.image) {
    const bunny = new Bunny();
    await bunny.delete(playlist.image);

    playlist.image = null;
    playlist.set('image', null);

    await GenerateImage.enqueue({
      playlistId: playlist.id,
    });
  }

  await playlist.save();

  const rssCache = `playlist-rss-${playlist.id}`;
  const m3uCache = `playlist-m3u-${playlist.id}`;

  await cache.deleteCache(rssCache, m3uCache);

  return res.status(200).json({ playlist })
}
