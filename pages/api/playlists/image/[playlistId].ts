import path from 'path';
import fs from 'fs';
import os from 'os';
import { NextApiRequest, NextApiResponse } from 'next'
import stream from 'stream';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import gm from 'gm';
import { promisify } from 'util';
import crypto from 'crypto';

import Playlist from '@/lib/models/playlist';
import PlaylistItem from '@/lib/models/playlistItem';
import Bunny from '@/lib/external/bunny';

// const DEFAULT_PLAYLIST_IMAGE = path.resolve(process.cwd(), 'public', 'playlist-placeholder.png');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.playlistId.toString();

  const playlist = await Playlist.findByPk(id, {
    include: [
      {
        model: PlaylistItem,
        as: 'items',
      },
    ],
    order: [['items', 'position', 'ASC']]
  });

  if (!playlist) {
    return res.status(404).json({ error: 'Invalid playlist' });
  }

  if (playlist.image) {
    return res.status(302).redirect(playlist.image);
  }

  const img: string[] = [];

  playlist.items.some((item) => {
    if (!img.includes(item.image)) {
      img.push(item.image);
    }
    return img.length === 4;
  });

  if (img.length > 1) {
    while (img.length < 4) {
      img.push(img[Math.floor(Math.random() * img.length)]);
    }
  }

  const promises: Promise<string>[] = [];

  img.forEach((image) => {
    if (image.slice(0, 1) === '/') {
      promises.push(Promise.resolve(image));
    } else {
      promises.push(new Promise(async (resolve, reject) => {
        const finished = promisify(stream.finished);
        const hash = crypto.createHash('md5').update(image).digest('hex');
        const tmpfile = os.tmpdir() + hash;;

        if (fs.existsSync(tmpfile)) {
          return resolve(tmpfile);
        }

        const writer = fs.createWriteStream(tmpfile);
        const result = await axios({
          url: image,
          method: 'GET',
          responseType: 'stream'
        });

        result.data.pipe(writer);

        await finished(writer);

        resolve(tmpfile);
      }));
    }
  });

  const filePaths: string[] = await Promise.all(promises);

  return new Promise((resolve, reject) => {
    const now = new Date().getTime().toString();
    const filename = `${playlist.id}.${now}.jpg`;
    const tmpfile = `${os.tmpdir()}/${filename}`;

    gm(filePaths[0])
      .geometry('512x512+0+0')
      .montage(filePaths[1])
      .montage(filePaths[2])
      .montage(filePaths[3])
      .tile('2x2')
      .write(tmpfile, async (err) => {
        const bunny = new Bunny();
        const url = await bunny.upload(
          tmpfile,
          `playlist-images/${filename}`,
        );

        playlist.set('image', url);
        await playlist.save();

        if (err) {
          return reject(err);
        }

        resolve(res.status(302).redirect(url));
      });
  });
}
