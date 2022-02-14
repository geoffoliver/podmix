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
} from "sequelize";

import sequelize from './index';
import PlaylistItem from "./playlistItem";

class Playlist extends Model<InferAttributes<Playlist>, InferCreationAttributes<Playlist>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare name?: string | null;

  declare getItems: HasManyGetAssociationsMixin<PlaylistItem>;
  declare addItem: HasManyAddAssociationMixin<PlaylistItem, string>;
  declare addItems: HasManyAddAssociationsMixin<PlaylistItem, string>;
  declare setitems: HasManySetAssociationsMixin<PlaylistItem, string>;
  declare removeItem: HasManyRemoveAssociationMixin<PlaylistItem, string>;
  declare removeItems: HasManyRemoveAssociationsMixin<PlaylistItem, string>;
  declare hasItem: HasManyHasAssociationMixin<PlaylistItem, string>;
  declare hasItems: HasManyHasAssociationsMixin<PlaylistItem, string>;
  declare countItems: HasManyCountAssociationsMixin;
  declare createItem: HasManyCreateAssociationMixin<PlaylistItem, 'playlistId'>;

  declare items: NonAttribute<PlaylistItem[]>;

  declare static associations: {
    items: Association<Playlist, PlaylistItem>;
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
}, {
  sequelize,
  tableName: 'playlists',
});

Playlist.hasMany(PlaylistItem, { foreignKey: 'playlistId', as: 'items' });

export default Playlist;
