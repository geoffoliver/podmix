import { Options } from 'sequelize';

const options: Options = {
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  dialect: 'mysql',
  logging: false, // process.env.NODE_ENV !== 'production',
};

type SequelizeConfig = {
  [key: string]: Options;
};

const config: SequelizeConfig = {
  development: options,
  test: options,
  production: options,
};

export default config;

// pretty sure this is just to get sequelize-cli to work... i think.
// module.exports = config;
