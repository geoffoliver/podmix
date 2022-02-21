import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import axios from 'axios';

import User from '@/lib/models/user';
import Bunny from '@/lib/external/bunny';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await User.findByPk(session.user.id);

  if (!user) {
    return res.status(400).json({ error: 'Invalid user' });
  }

  if (req.body.name) {
    user.set('name', req.body.name);
  }

  if (req.body.email) {
    user.set('email', req.body.email);
  }

  let toDelete = null;
  if (req.body.image) {
    if (req.body.image !== user.image) {
      toDelete = user.image;
    }
    user.set('image', req.body.image);
  }

  await user.save();

  if (toDelete) {
    const bunny = new Bunny();
    await bunny.delete(toDelete);
  }

  return res.status(200).json({ user })
}
