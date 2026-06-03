// Metro configuration for the ATIMAR monorepo.
// Lets Metro resolve the workspace packages (@atimar/*) from the repo root:
//  - watch the whole monorepo so changes in packages/* trigger reloads;
//  - resolve modules from both the app and the hoisted root node_modules.
// https://docs.expo.dev/guides/monorepos/

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;
