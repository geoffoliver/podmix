import type { NextApiRequest, NextApiResponse } from 'next'
import { Feed } from 'feed';

import Playlist from '@/lib/models/playlist';
import PlaylistItem from '@/lib/models/playlistItem';

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

  const f = new Feed({
    id: playlist.id,
    title: playlist.name,
    description: playlist.description,
    link: `${process.env.PUBLIC_URL}/playlist/${playlist.id}`,
    copyright: new Date().getFullYear().toString(),
    // TODO: image
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

  return res
    .setHeader('content-type', 'application/rss+xml')
    .setHeader('content-disposition', `attachment; filename=${playlist.name}.xml`)
    .status(200)
    .end(f.rss2());
}
