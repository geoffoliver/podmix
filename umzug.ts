import { Umzug, SequelizeStorage } from 'umzug/lib';

import sequelize from './lib/models';

export const migrator = new Umzug({
	migrations: {
		glob: ['migrations/*.ts', { cwd: __dirname }],
	},
	context: sequelize,
	storage: new SequelizeStorage({
		sequelize,
    timestamps: true,
	}),
	logger: console,
});

export type Migration = typeof migrator._types.migration;
