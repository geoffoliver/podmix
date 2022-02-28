import fs from 'fs';
import os from 'os';
import stream from 'stream';
import { promisify } from 'util';
import crypto from 'crypto';
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  Association,
  BelongsToGetAssociationMixin,
} from 'sequelize';
import { HookReturn } from 'sequelize/types/hooks';
import { searchIndex } from '../external/algolia';
import Bunny from '../external/bunny';
import axios from 'axios';
import sharp from 'sharp';

import sequelize from './index';
import PlaylistItem from './playlistItem';
import Podcast from './podcast';
import User from './user';

class Playlist extends Model<InferAttributes<Playlist>, InferCreationAttributes<Playlist>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare name?: string | null;
  declare description?: string | null;
  declare image?: string | null;

  declare getItems: HasManyGetAssociationsMixin<PlaylistItem>;
  declare addItem: HasManyAddAssociationMixin<PlaylistItem, string>;
  declare addItems: HasManyAddAssociationsMixin<PlaylistItem, string>;
  declare setItems: HasManySetAssociationsMixin<PlaylistItem, string>;
  declare removeItem: HasManyRemoveAssociationMixin<PlaylistItem, string>;
  declare removeItems: HasManyRemoveAssociationsMixin<PlaylistItem, string>;
  declare hasItem: HasManyHasAssociationMixin<PlaylistItem, string>;
  declare hasItems: HasManyHasAssociationsMixin<PlaylistItem, string>;
  declare countItems: HasManyCountAssociationsMixin;
  declare createItem: HasManyCreateAssociationMixin<PlaylistItem, 'playlistId'>;
  declare getUser: BelongsToGetAssociationMixin<User>

  declare items: NonAttribute<PlaylistItem[]>;
  declare user: NonAttribute<User>;

  declare static associations: {
    items: Association<Playlist, PlaylistItem>;
    user: Association<Playlist, User>;
  }

  async generateImage(): Promise<string> {
    const img: string[] = [];

    const items = await this.getItems({
      order: [['position', 'ASC']]
    });

    items.some((item) => {
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
          const tmpfile = os.tmpdir() + hash;

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

    return new Promise(async (resolve, reject) => {
      const now = new Date().getTime().toString();
      const filename = `${this.id}.${now}.webp`;
      const tmpfile = `${os.tmpdir()}/${filename}`;
      const width = 512;
      const height = 512;
      const channels = 3;

      if (filePaths.length === 1) {
        sharp(filePaths[0])
          .resize(width, height, { fit: 'outside' })
          .webp({ quality: 90 })
          .toFile(tmpfile, async (err: any, info: any) => {
            if (err) {
              return reject(err);
            }
            const bunny = new Bunny();
            const url = await bunny.upload(
              tmpfile,
              `playlist-images/${filename}`,
            );

            this.image = url;
            this.set('image', url);
            await this.save();

            return resolve(url);
          });
      } else {
        await Promise.all(filePaths.map((f) => {
          return sharp(fs.readFileSync(f)).resize(width / 2, height /2, { fit: 'outside' }).toFile(f);
        }));
        sharp({ create: { width, height, channels, background: '#000' } })
          .composite([
            { input: filePaths[0], top: 0, left: 0 },
            { input: filePaths[1], top: 0, left: 256 },
            { input: filePaths[2], top: 256, left: 0 },
            { input: filePaths[3], top: 256, left: 256 },
          ])
          .webp({ quality: 90 })
          .toFile(tmpfile, async (err: any, info: any) => {
            if (err) {
              return reject(err);
            }

            const bunny = new Bunny();
            const url = await bunny.upload(
              tmpfile,
              `playlist-images/${filename}`,
            );

            this.image = url;
            this.set('image', url);
            await this.save();

            return resolve(url);
          });
      }
    });
  }

  async updateSearchIndex(): Promise<HookReturn> {
    await this.reload({
      include: [
        {
          model: PlaylistItem,
          as: 'items',
          attributes: [
            'title', 'duration',
          ],
          include: [
            {
              model: Podcast,
              as: 'podcast',
              attributes: [
                'name', 'iTunesGenres'
              ]
            },
          ],
        },
      ],
    });

    let duration = 0;
    let episodes = new Set();
    let genres = new Set();
    let shows = new Set();

    this.items.forEach((item) => {
      duration += item.duration;
      shows.add(item.podcast.name);
      episodes.add(item.title);

      if (item.podcast.iTunesGenres) {
        item.podcast.iTunesGenres
          .filter((g) => g !== 'Podcasts')
          .forEach((g) => {
            genres.add(g);
          });
      }
    });

    if (!this.image) {
      await this.generateImage();
    }

    await searchIndex.saveObject({
      objectID: this.id,
      name: this.name,
      image: this.image,
      // author: user.name,
      description: this.description,
      genres: Array.from(genres),
      shows: Array.from(shows),
      episodes: Array.from(episodes),
      duration,
    });
  }
}

Playlist.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'playlists',
});

Playlist.addHook('afterSave', async (inst: Playlist) => {
  return inst.updateSearchIndex();
});

Playlist.addHook('afterDestroy', async (inst: Playlist) => {
  if (inst.image) {
    const bunny = new Bunny();
    await bunny.delete(inst.image);
  }

  await searchIndex.deleteObject(inst.id);
});

Playlist.hasMany(PlaylistItem, { foreignKey: 'playlistId', as: 'items' });
PlaylistItem.belongsTo(Playlist, { foreignKey: 'playlistId', as: 'Playlist' });

export default Playlist;
