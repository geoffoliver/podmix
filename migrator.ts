import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir, process.env.NODE_ENV !== 'production');

require('./umzug').migrator.runAsCLI();

export {};
