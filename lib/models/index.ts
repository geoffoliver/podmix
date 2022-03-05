import crypto from 'crypto';
import os from 'os';
import fs from 'fs';
import axios from 'axios';
import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize
} from 'sequelize';
import { HookReturn } from 'sequelize/types/hooks';
import stream from 'stream';
import { promisify } from 'util';
import { models } from '@next-auth/sequelize-adapter';
import sharp from 'sharp';
import UpdateSearchIndex from '@/pages/api/playlists/update-search-index'

import { searchIndex } from '@/lib/external/algolia';
import Bunny from '@/lib/external/bunny';
import { ItemWithiTunes } from '@/lib/types/podcast';
import { iTunesResult } from '@/lib/external/itunes';
import config from './config';

const sequelize = new Sequelize(config[process.env.NODE_ENV || 'development']);

/**
 * This is fucking disgusting, and I hate myself for it... I _had_ all the
 * models split out into their own files, everything nice and neat, but I'll be
 * **fucked** if I couldn't get things to play nice. Always some bullshit about
 * trying to access __WEBPACK_DEFAULT_EXPORT__ before it was available, or some
 * other stupid fuckerry that made zero sense. I fought with it for hours and
 * decided "fuck it" because this works. Fuck you, typescript, sequelize
 * (probably sequelize because their documentation is fucking dogshit), or
 * whatever is responsible for this shit. Fuck you hard.
 */
// #region Playlist

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

  async generateImage(): Promise<void> {
    const img: string[] = [];

    const items = await this.getItems({
      order: [['position', 'ASC']],
      attributes: ['image'],
    });

    if (items.length === 0) {
      return;
    }

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

            this.set('image', url);

            await this.save();

            fs.unlinkSync(tmpfile);

            return resolve();
          });
      } else {
        await Promise.all(filePaths.slice().map((f, i) => {
          filePaths[i] = `${f}_small.webp`;
          return sharp(fs.readFileSync(f))
            .resize(Math.round(width / 2), Math.round(height / 2), { fit: 'outside' })
            .webp({ quality: 100 })
            .toFile(filePaths[i]);
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

            this.set('image', url);
            await this.save({
              hooks: false,
            });

            fs.unlinkSync(tmpfile);

            return resolve();
          });
      }
    });
  }

  async updateSearchIndex(): Promise<HookReturn> {
    await this.reload({
      include: [
        {
          model: User,
          as: 'user',
        },
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

    await searchIndex.saveObject({
      objectID: this.id,
      name: this.name,
      image: `${process.env.PUBLIC_URL}/playlists/image/${this.id}`,
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
  await UpdateSearchIndex.enqueue({
    playlistId: inst.id,
  });
});

Playlist.addHook('afterDestroy', async (inst: Playlist) => {
  if (inst.image) {
    const bunny = new Bunny();
    await bunny.delete(inst.image);
  }

  try {
    await searchIndex.deleteObject(inst.id);
  } catch (ex) {
    console.error('An error occurred deleting the object from the search index', ex.message);
  }
});

// #endregion
// #region PlaylistItem

class PlaylistItem extends Model<InferAttributes<PlaylistItem>, InferCreationAttributes<PlaylistItem>> {
  declare id: CreationOptional<string>;
  declare playlistId: string;
  declare podcastId: string;
  declare position: number;
  declare title: string;
  declare pubDate: Date;
  declare description: string | null;
  declare image: string;
  declare duration: number | null;
  declare artist: string;
  declare url: string;
  declare filesize: number;
  declare feedData: ItemWithiTunes;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare playlist: NonAttribute<Playlist>;
  declare podcast: NonAttribute<Podcast>;

  declare static associations: {
    playlist: Association<PlaylistItem, Playlist>;
    podcast: Association<PlaylistItem, Podcast>;
  }
}

PlaylistItem.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  playlistId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  podcastId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pubDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  filesize: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  feedData: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: 'playlist_items',
});

// #endregion
// #region Podcast

class Podcast extends Model<InferAttributes<Podcast>, InferCreationAttributes<Podcast>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare image: string;

  declare iTunesArtistName: string;
  declare iTunesCollectionName: string;
  declare iTunesTrackName: string;
  declare iTunesPrimaryGenreName: string;
  declare iTunesGenres: string[];
  declare iTunesData: iTunesResult;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare playlistItems: NonAttribute<PlaylistItem[]>;

  declare static associations: {
    playlist: Association<Podcast, PlaylistItem>;
  }
}

Podcast.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  iTunesArtistName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  iTunesCollectionName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  iTunesTrackName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  iTunesPrimaryGenreName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  iTunesGenres: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  iTunesData: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: 'podcasts',
});

// #endregion
// #region User

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare emailVerified: Date;
  declare image: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare playlists: NonAttribute<Playlist[]>;

  declare static associations: {
    playlists: Association<User, Playlist>;
  }
}

User.init({
  ...models.User,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: 'users',
});

// #endregion
// #region Relationships

User.hasMany(Playlist, { as: 'playlists', foreignKey: 'userId' });
Playlist.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Podcast.hasMany(PlaylistItem, { as: 'items', foreignKey: 'podcastId' });
PlaylistItem.belongsTo(Podcast, { as: 'podcast', foreignKey: 'podcastId' });
Playlist.hasMany(PlaylistItem, { foreignKey: 'playlistId', as: 'items' });
PlaylistItem.belongsTo(Playlist, { foreignKey: 'playlistId', as: 'Playlist' });

// #endregion

export {
  Playlist,
  PlaylistItem,
  Podcast,
  User,
};

export default sequelize;
