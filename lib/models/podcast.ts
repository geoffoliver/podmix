import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute,
  Association,
} from "sequelize";

import { iTunesResult } from "@/lib/external/itunes";

import sequelize from './index';
import PlaylistItem from './playlistItem';

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

Podcast.hasMany(PlaylistItem, { as: 'items', foreignKey: 'podcastId' });
PlaylistItem.belongsTo(Podcast, { as: 'podcast', foreignKey: 'podcastId' });

export default Podcast;
