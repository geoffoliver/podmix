import { Sequelize } from 'sequelize';

import config from './config';

// import Playlist from './playlist';
// import PlaylistItem from './playlistItem';

const sequelize = new Sequelize(config[process.env.NODE_ENV || 'development']);

export default sequelize;
