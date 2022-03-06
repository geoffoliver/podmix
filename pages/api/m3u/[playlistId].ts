import type { NextApiRequest, NextApiResponse } from 'next';
import { M3uPlaylist, M3uMedia } from 'm3u-parser-generator';

import { Playlist, PlaylistItem, Podcast } from '@/lib/models';
import cache from '@/lib/cache';

const CACHE_TIME = 60 * 60;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const playlist = await Playlist.findByPk(req.query.playlistId.toString(), {
    include: [
      {
        model: PlaylistItem,
        as: 'items',
        include: [{
          model: Podcast,
          as: 'podcast',
        }],
      },
    ],
    order: [['items', 'position', 'ASC']],
  });

  if (!playlist) {
    return res.status(404).json({ error: 'Invalid playlist' });
  }

  const cacheKey = `playlist-m3u-${playlist.id}`;
  const cached = await cache.getCache(cacheKey);
  if (cached) {
    return res
      .setHeader('content-type', 'application/m3u')
      .setHeader('content-disposition', `attachment; filename=${playlist.name}.m3u`)
      .status(200)
      .end(cached);
  }

  const list = new M3uPlaylist();
  list.title = playlist.name;

  playlist.items.forEach((item) => {
    const media = new M3uMedia(item.url);
    media.name = `${item.artist} - ${item.title}`;
    media.group = item.podcast.iTunesCollectionName;
    list.medias.push(media);
  });

  const m3uPlaylist = list.getM3uString();

  await cache.setCache(cacheKey, m3uPlaylist, CACHE_TIME);

  return res
    .setHeader('content-type', 'application/m3u')
    .setHeader('content-disposition', `attachment; filename=${playlist.name}.m3u`)
    .status(200)
    .end(m3uPlaylist);
}
