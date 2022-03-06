import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import { Favorite, User } from '@/lib/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'DELETE') {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const user = await User.findByPk(session.user.id);

  if (!user) {
    return res.status(400).json({ error: 'Invalid user' });
  }

  const favorite = await Favorite.findByPk(req.query.favoriteId.toString());

  if (!favorite) {
    return res.status(400).json({ error: 'Invalid favorite' });
  }

  await favorite.destroy();

  const favorites = await user.getFavorites();

  return res.status(200).json({ favorites })
}
