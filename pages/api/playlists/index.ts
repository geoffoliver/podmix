import type { NextApiRequest, NextApiResponse } from 'next'

import { Playlist, User } from '@/lib/models';
import { WhereOptions } from 'sequelize/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let playlists: Playlist[] = [];

  const limit = 30;
  let where: WhereOptions<Playlist> = undefined;
  let offset = 0;

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
    include: [
      {
        model: User,
        as: 'user',
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({ playlists })
}
