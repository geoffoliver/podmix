import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute,
  Association,
} from "sequelize";
import { models } from "@next-auth/sequelize-adapter";

import sequelize from './index';
import Playlist from './playlist';

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

User.hasMany(Playlist, { as: 'playlists', foreignKey: 'userId' });
Playlist.belongsTo(User, { as: 'user', foreignKey: 'userId' });

export default User;
