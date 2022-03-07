import type { NextApiRequest, NextApiResponse } from 'next';
import { Feed } from 'feed';

import { Playlist, PlaylistItem } from '@/lib/models';
import cache from '@/lib/cache';

const CACHE_TIME = 60 * 60;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const playlist = await Playlist.findByPk(req.query.playlistId.toString(), {
    include: [
      {
        model: PlaylistItem,
        as: 'items',
      },
    ],
    order: [['items', 'position', 'ASC']],
  });

  if (!playlist) {
    return res.status(404).json({ error: 'Invalid playlist' });
  }

  const cacheKey = `playlist-rss-${playlist.id}`;
  const cached = await cache.getCache(cacheKey);
  let rssFeed: string = '';

  if (cached) {
    rssFeed = cached;
  } else {
    const f = new Feed({
      id: playlist.id,
      title: playlist.name,
      description: playlist.description,
      link: `${process.env.PUBLIC_URL}/playlist/${playlist.id}`,
      copyright: new Date().getFullYear().toString(),
      image: `${process.env.PUBLIC_URL}/api/playlists/image/${playlist.id}`,
      favicon: `${process.env.PUBLIC_URL}/api/playlists/image/${playlist.id}`,
      updated: new Date(),
      generator: 'Podmix',
    });

    playlist.items.forEach((item) => {
      f.addItem({
        title: item.title,
        id: item.id,
        guid: item.url,
        link: item.feedData.link,
        date: item.pubDate,
        description: item.description,
        enclosure: {
          url: item.url.replace(/&/g, '&amp;').replace(/=/g, '%3D'),
          length: item.filesize,
          type: 'audio/mpeg',
          title: item.title,
        },
      });
    });

    rssFeed = f.rss2();

    await cache.setCache(cacheKey, rssFeed, CACHE_TIME);
  }

  return res
    .setHeader('content-type', 'application/xml')
    .status(200)
    .send(rssFeed);
}
