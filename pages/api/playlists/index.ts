import type { NextApiRequest, NextApiResponse } from 'next'

import Playlist from '@/lib/models/playlist';
import { WhereOptions } from 'sequelize/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let playlists: Playlist[] = [];

  const limit = 100;
  let where: WhereOptions<Playlist> = undefined;
  let offset = 0;

  // TODO: populate `where`

  if (req.query.page) {
    let pageNum = Number(req.query.page);
    if (pageNum > 0) {
      offset = (pageNum - 1) * offset;
    }
  }

  playlists = await Playlist.findAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({ playlists })
}
