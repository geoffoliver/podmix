import { DataTypes } from 'sequelize';
import { Migration } from '../umzug';

export const up: Migration = async ({ context: sequelize }) => {
  const query = sequelize.getQueryInterface();

  await query.changeColumn('accounts', 'id_token', {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().changeColumn('accounts', 'id_token', {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  });
};
