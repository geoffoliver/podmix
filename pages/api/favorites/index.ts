import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import { User, Playlist } from '@/lib/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await User.findByPk(session.user.id);

  if (!user) {
    return res.status(400).json({ error: 'Invalid user' });
  }

  const favorites = await user.getFavorites({
    include: [
      {
        model: Playlist,
        as: 'playlist',
        include: [
          {
            model: User,
            as: 'user',
          },
        ],
      },
    ],
  });

  return res.status(200).json({ favorites })
}
