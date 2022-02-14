import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute,
  Association,
} from "sequelize";

import sequelize from './index';
import Playlist from './playlist';

class PlaylistItem extends Model<InferAttributes<PlaylistItem>, InferCreationAttributes<PlaylistItem>> {
  declare id: CreationOptional<string>;
  declare playlistId: string;
  declare collectionId: number;
  declare collectionName: string;
  declare description: string | null;
  declare position: number;
  declare image: string;
  declare duration: string | null;
  declare artistName: string;
  declare mediaUrl: string;
  declare link: string | null;
  declare title: string;
  declare pubDate: Date;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare playlist: NonAttribute<Playlist>;

  declare static associations: {
    playlist: Association<PlaylistItem, Playlist>;
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
  collectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  collectionName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pubDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: 'playlist_items',
});

export default PlaylistItem;
