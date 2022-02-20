import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import User from '@/lib/models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await User.findByPk(session.user.id);

  if (req.body.name) {
    user.set('name', req.body.name);
  }

  if (req.body.email) {
    user.set('email', req.body.email);
  }

  if (req.body.image) {
    user.set('image', req.body.image);
  }

  await user.save();

  return res.status(200).json({ user })
}
