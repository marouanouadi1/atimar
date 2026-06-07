// Metro configuration for the ATIMAR app.
// Shared code under ../../packages is source-only: no package.json, no pnpm
// workspace package, no separate tsconfig. Metro resolves @atimar/* aliases here.
// https://docs.expo.dev/guides/monorepos/

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const repoRoot = path.resolve(projectRoot, '../..');
const packagesRoot = path.resolve(repoRoot, 'packages');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [packagesRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(repoRoot, 'node_modules'),
];
config.resolver.extraNodeModules = {
  '@atimar/data': path.resolve(packagesRoot, 'data/src'),
  '@atimar/types': path.resolve(packagesRoot, 'types/src'),
  '@atimar/utils': path.resolve(packagesRoot, 'utils/src'),
};

module.exports = config;
