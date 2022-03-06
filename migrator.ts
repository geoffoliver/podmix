import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

require('./umzug').migrator.runAsCLI();

export {};
