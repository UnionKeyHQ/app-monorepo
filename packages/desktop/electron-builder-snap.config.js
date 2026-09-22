/* eslint-disable no-template-curly-in-string */
require('../../development/env');

module.exports = {
  'extraMetadata': {
    'main': 'dist/app.js',
    'version': process.env.VERSION,
  },
  'appId': 'so.unionkey.wallet.desktop',
  'productName': 'UnionKey',
  'copyright': 'Copyright © ${author}',
  'asar': true,
  'buildVersion': process.env.BUILD_NUMBER,
  'directories': {
    'output': 'build-electron',
  },
  'files': [
    'build/**/*',
    '!build/static/bin/**/*',
    'dist/**/*.js',
    '!dist/__**',
    'package.json',
  ],
  'protocols': {
    'name': 'electron-deep-linking',
    'schemes': ['unionkey-wallet', 'wc', 'ethereum'],
  },
  'extraResources': [
    {
      'from': 'build/static/images/icons/512x512.png',
      'to': 'static/images/icons/512x512.png',
    },
    {
      'from': 'build/static/preload.js',
      'to': 'static/preload.js',
    },
  ],
  'publish': {
    'provider': 'github',
    'repo': 'app-monorepo',
    'owner': 'UnionKeyHQ',
  },
  'snap': {
    'grade': 'stable',
  },
  'linux': {
    'extraResources': [
      {
        'from': 'build/static/bin/bridge/linux-${arch}',
        'to': 'bin/bridge',
      },
    ],
    'icon': 'build/static/images/icons/512x512.png',
    'artifactName': 'UnionKey-Wallet-${version}-linux-${arch}.${ext}',
    'executableName': 'unionkey-wallet',
    'category': 'Utility',
    'target': ['snap'],
  },
  'afterSign': 'scripts/notarize.js',
};
