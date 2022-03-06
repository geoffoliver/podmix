import { DataTypes } from 'sequelize';
import { Migration } from '../umzug';

export const up: Migration = async ({ context: sequelize }) => {
  const query = sequelize.getQueryInterface();

  await query.createTable('podcasts', {
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
      defaultValue: null,
    },
    iTunesGenres: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    iTunesData: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('podcasts');
};
