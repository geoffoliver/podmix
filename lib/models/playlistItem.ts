import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute,
  Association,
} from "sequelize";
import { ItemWithiTunes } from "../types/podcast";

import sequelize from './index';
import Playlist from './playlist';
import Podcast from './podcast';

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
    type: DataTypes.STRING,
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

export default PlaylistItem;
