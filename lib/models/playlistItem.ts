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
  declare url: string;
  declare playlistId: string;

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
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  playlistId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'playlist_items',
});

export default PlaylistItem;
