import type { NextApiRequest, NextApiResponse } from 'next'
import { M3uPlaylist, M3uMedia } from 'm3u-parser-generator';

import Playlist from '@/lib/models/playlist';
import PlaylistItem from '@/lib/models/playlistItem';
import Podcast from '@/lib/models/podcast';

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

  const list = new M3uPlaylist();
  list.title = playlist.name;

  playlist.items.forEach((item) => {
    const media = new M3uMedia(item.url);
    media.name = `${item.artist} - ${item.title}`;
    media.group = item.podcast.iTunesCollectionName;
    list.medias.push(media);
  });

  return res
    .setHeader('content-type', 'application/m3u')
    .setHeader('content-disposition', `attachment; filename=${playlist.name}.m3u`)
    .status(200)
    .end(list.getM3uString());
}
