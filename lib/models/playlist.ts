import path from 'path';
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
} from 'sequelize';
import { HookReturn } from 'sequelize/types/hooks';
import { searchIndex } from '../external/algolia';
import Bunny from '../external/bunny';
import gm from 'gm';
import axios from 'axios';

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

    return new Promise((resolve, reject) => {
      const now = new Date().getTime().toString();
      const filename = `${this.id}.${now}.jpg`;
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

          this.image = url;
          this.set('image', url);
          await this.save();

          if (err) {
            return reject(err);
          }

          return resolve(url);
        });
    });
  }

  async updateSearchIndex(): Promise<HookReturn> {
    await this.reload({
      include: [
        'user',
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
      author: this.user.name,
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
