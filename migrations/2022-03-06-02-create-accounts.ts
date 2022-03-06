import { DataTypes } from 'sequelize';
import { Migration } from '../umzug';

export const up: Migration = async ({ context: sequelize }) => {
  const query = sequelize.getQueryInterface();

  await query.createTable('accounts', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider_account_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    access_token: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    expires_at: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    token_type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    id_token: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    session_state: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  });

  await query.addIndex('accounts', ['user_id']);
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('accounts');
};
