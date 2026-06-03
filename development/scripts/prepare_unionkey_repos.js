#!/usr/bin/env node

const repos = [
  {
    name: 'app-monorepo',
    source: 'zyfshr/app-monorepo',
    description: 'UnionKey wallet monorepo',
  },
  {
    name: 'cross-inpage-provider',
    source: 'OneKeyHQ/cross-inpage-provider',
    description: 'UnionKey inpage provider packages',
  },
  {
    name: 'hardware-js-sdk',
    source: 'OneKeyHQ/hardware-js-sdk',
    description: 'UnionKey hardware JavaScript SDK packages',
  },
  {
    name: 'onekey-cross-webview',
    source: 'OneKeyHQ/onekey-cross-webview',
    description: 'UnionKey cross webview bridge package',
  },
  {
    name: 'react-native-webview',
    source: 'OneKeyHQ/react-native-webview',
    description: 'UnionKey React Native webview fork',
  },
  {
    name: 'react-native-webview-cleaner',
    source: 'OneKeyHQ/react-native-webview-cleaner',
    description: 'UnionKey webview cleaner fork',
  },
  {
    name: 'react-native-cloud-fs',
    source: 'OneKeyHQ/react-native-cloud-fs',
    description: 'UnionKey React Native cloud filesystem fork',
  },
  {
    name: 'react-native-animated-charts',
    source: 'OneKeyHQ/react-native-animated-charts',
    description: 'UnionKey React Native animated charts fork',
  },
  {
    name: 'react-native-ble-utils',
    source: 'OneKeyHQ/react-native-ble-utils',
    description: 'UnionKey React Native BLE utilities fork',
  },
  {
    name: 'react-native-lite-card',
    source: 'OneKeyHQ/react-native-lite-card',
    description: 'UnionKey React Native lite card fork',
  },
  {
    name: 'react-native-tab-page-view',
    source: 'OneKeyHQ/react-native-tab-page-view',
    description: 'UnionKey React Native tab page view fork',
  },
  {
    name: 'react-native-text-input',
    source: 'OneKeyHQ/react-native-text-input',
    description: 'UnionKey React Native text input fork',
  },
  {
    name: 'jcore-react-native',
    source: null,
    description: 'UnionKey JCore React Native package',
  },
  {
    name: 'jpush-react-native',
    source: null,
    description: 'UnionKey JPush React Native package',
  },
  {
    name: 'react-native-nested-scroll-view',
    source: null,
    description: 'UnionKey React Native nested scroll view package',
  },
];

const useGh = process.argv.includes('--gh');

function quote(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function printRepoCommands(repo) {
  const target = `UnionKeyHQ/${repo.name}`;
  console.log(`# ${target}`);
  if (repo.source) {
    console.log(
      `gh repo fork ${repo.source} --org UnionKeyHQ --remote=false --clone=false`,
    );
  } else {
    console.log(
      [
        'gh repo create',
        target,
        '--private',
        `--description ${quote(repo.description)}`,
      ].join(' '),
    );
  }
  console.log('');
}

console.log('# UnionKey repository preparation commands');
console.log('# Install/auth GitHub CLI first: gh auth login');
console.log('');

if (!useGh) {
  console.log(
    '# Dry run. Add --gh to print commands intended to run after review.',
  );
  console.log('');
}

repos.forEach(printRepoCommands);
