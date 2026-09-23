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
      'from': '../../node_modules/@unionkeyhq/hd-web-sdk/build',
      'to': 'static/js-sdk',
    },
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
  'dmg': {
    'sign': false,
    'contents': [
      {
        'x': 410,
        'y': 175,
        'type': 'link',
        'path': '/Applications',
      },
      {
        'x': 130,
        'y': 175,
        'type': 'file',
      },
    ],
    'background': 'build/static/images/icons/background.png',
  },
  'nsis': {
    'oneClick': false,
    'installerSidebar': 'build/static/images/icons/installerSidebar.bmp',
  },
  'mac': {
    'extraResources': [
      {
        'from': 'build/static/bin/bridge/mac-${arch}',
        'to': 'bin/bridge',
      },
    ],
    'icon': 'build/static/images/icons/512x512.png',
    'artifactName': 'UnionKey-Wallet-${version}-mac-${arch}.${ext}',
    'hardenedRuntime': true,
    'gatekeeperAssess': false,
    'darkModeSupport': false,
    'category': 'productivity',
    'target': [
      { target: 'dmg', arch: ['x64', 'arm64'] },
      { target: 'zip', arch: ['x64', 'arm64'] },
    ],
    'entitlements': 'entitlements.mac.plist',
    'extendInfo': {
      'NSCameraUsageDescription': 'Please allow UnionKey to use your camera',
    },
  },
  'win': {
    'extraResources': [
      {
        'from': 'build/static/bin/bridge/win-${arch}',
        'to': 'bin/bridge',
      },
    ],
    'icon': 'build/static/images/icons/512x512.png',
    'artifactName': 'UnionKey-Wallet-${version}-win-${arch}.${ext}',
    'verifyUpdateCodeSignature': false,
    'target': [{ target: 'nsis', arch: ['x64', 'arm64'] }],
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
    'target': [{ target: 'AppImage', arch: ['x64', 'arm64'] }],
  },
  'afterSign': 'scripts/notarize.js',
};
