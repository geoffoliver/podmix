import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import formidable from 'formidable';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import gm from 'gm';

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

  const form = formidable({
    maxFiles: 1,
    maxFileSize: 0.5 * 1024 * 1024,
    filter: ({ mimetype }) => {
      return mimetype.includes('image');
    }
  });

  return new Promise((resolve, reject) => {
    return form.parse(req, async (err, fields, file) => {
      const filename = `${user.id}.${uuid()}.${fields.name.toString().split('.').pop()}`;
      const filepath = `user-pictures/${filename}`;
      const f = Array.isArray(file) ? file[0] : file;

      try {
        gm(f.file.filepath)
          .resize(256, 256, '!')
          .noProfile()
          .write(f.file.filepath, async (err) => {
            if (err) {
              throw err;
            }

            const bunny = new Bunny();
            const url = await bunny.upload(
              f.file.filepath,
              filepath,
            );

            if (url) {
              return resolve(res.status(200).json({ url }));
            }

            throw new Error('Error uploading file!');
          });
      } catch (ex) {
        return reject(res.status(500).json({ error: ex.message }));
      }
    });
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
};
