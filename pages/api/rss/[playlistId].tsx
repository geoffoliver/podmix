import type { NextApiRequest, NextApiResponse } from 'next'
import { Feed } from 'feed';

import Playlist from '@/lib/models/playlist';
import PlaylistItem from '@/lib/models/playlistItem';
import cache from '@/lib/cache';

const CACHE_TIME = 60 * 60;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const playlist = await Playlist.findByPk(req.query.playlistId.toString(), {
    include: [
      {
        model: PlaylistItem,
        as: 'items',
      }
    ],
    order: [['items', 'position', 'ASC']],
  });

  if (!playlist) {
    return res.status(404).json({ error: 'Invalid playlist' });
  }

  const cacheKey = `playlist-rss-${playlist.id}`;
  const cached = await cache.getCache(cacheKey);
  if (cached) {
    return res
      .setHeader('content-type', 'application/rss+xml')
      .setHeader('content-disposition', `attachment; filename=${playlist.name}.xml`)
      .status(200)
      .end(cached);
  }

  const f = new Feed({
    id: playlist.id,
    title: playlist.name,
    description: playlist.description,
    link: `${process.env.PUBLIC_URL}/playlist/${playlist.id}`,
    copyright: new Date().getFullYear().toString(),
    image: `${process.env.PUBLIC_URL}/api/playlists/image/${playlist.id}`,
  });

  playlist.items.forEach((item) => {
    f.addItem({
      title: item.title,
      id: item.id,
      link: item.feedData.link,
      date: item.pubDate,
      description: item.description,
      audio: {
        url: item.url,
        length: item.filesize,
      },
    });
  });

  const rssFeed = f.rss2();

  await cache.setCache(cacheKey, rssFeed, CACHE_TIME);

  return res
    .setHeader('content-type', 'application/rss+xml')
    .setHeader('content-disposition', `attachment; filename=${playlist.name}.xml`)
    .status(200)
    .end(rssFeed);
}
