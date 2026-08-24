/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const desktopDir = path.resolve(__dirname, '..');
const outputDir = path.join(desktopDir, 'build-electron');
const currentGpgFingerprint = '8270C42EE15D14065D58E0B763AF8304B14D3F7F';

function fail(message) {
  console.error(`[secure-release] ${message}`);
  process.exit(1);
}

function run(command, args, env) {
  const result = spawnSync(command, args, {
    cwd: desktopDir,
    env,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

const releaseVersion = process.env.RELEASE_VERSION?.trim();
const releaseArchitectures = (
  process.env.WINDOWS_RELEASE_ARCHES || 'x64'
)
  .split(',')
  .map((arch) => arch.trim())
  .filter(Boolean);
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(releaseVersion || '')) {
  fail('set RELEASE_VERSION to the new semantic version, for example 6.0.1');
}
if (!process.env.WINDOWS_PUBLISHER_NAME?.trim()) {
  fail('WINDOWS_PUBLISHER_NAME must match the production certificate');
}
if (
  !process.env.CSC_LINK &&
  !process.env.WIN_CSC_LINK &&
  !process.env.WIN_CSC_SHA1
) {
  fail('provide CSC_LINK/WIN_CSC_LINK or an installed certificate via WIN_CSC_SHA1');
}
if (!process.env.GPG_SIGNING_KEY?.trim()) {
  fail('GPG_SIGNING_KEY is required');
}
if (process.env.ALLOW_TEST_CERTIFICATE === '1') {
  fail('test certificates are not allowed by the production release command');
}
for (const arch of releaseArchitectures) {
  if (!['x64', 'arm64'].includes(arch)) {
    fail(`unsupported Windows architecture: ${arch}`);
  }
  const bridgeDir = path.join(
    desktopDir,
    'public',
    'static',
    'bin',
    'bridge',
    `win-${arch}`,
  );
  if (!fs.existsSync(bridgeDir)) {
    fail(`missing required native bridge: ${bridgeDir}`);
  }
}

const gpgKeyInfo = spawnSync(
  'gpg.exe',
  [
    '--batch',
    '--with-colons',
    '--fingerprint',
    process.env.GPG_SIGNING_KEY.trim(),
  ],
  { encoding: 'utf8' },
);
const signingFingerprint = gpgKeyInfo.stdout
  .split(/\r?\n/)
  .find((line) => line.startsWith('fpr:'))
  ?.split(':')[9]
  ?.toUpperCase();
if (!signingFingerprint) {
  fail('GPG_SIGNING_KEY could not be resolved');
}
if (signingFingerprint !== currentGpgFingerprint) {
  fail(`UnionKey releases must use GPG key ${currentGpgFingerprint}`);
}

const releaseEnv = {
  ...process.env,
  VERSION: releaseVersion,
  REQUIRE_WINDOWS_CODE_SIGNING: '1',
  WINDOWS_RELEASE_ARCHES: releaseArchitectures.join(','),
};
run('yarn.cmd', ['build:win'], releaseEnv);

const manifestPath = path.join(outputDir, 'latest.yml');
if (!fs.existsSync(manifestPath)) {
  fail('electron-builder did not create latest.yml');
}
const manifestText = fs.readFileSync(manifestPath, 'utf8');
const artifactNames = [
  ...manifestText.matchAll(/^\s*- url:\s*['"]?([^'"\r\n]+\.exe)['"]?\s*$/gim),
].map((match) => decodeURIComponent(match[1]));
if (!artifactNames.length) {
  fail('latest.yml contains no Windows installers');
}

for (const artifactName of artifactNames) {
  run(
    process.execPath,
    [
      path.join(__dirname, 'verifyWindowsRelease.js'),
      '--artifact',
      path.join(outputDir, artifactName),
      '--manifest',
      manifestPath,
      '--sign',
    ],
    releaseEnv,
  );
}

console.log(
  `[secure-release] ${releaseVersion} is signed and verified locally. Upload the installers, blockmaps, latest.yml, and every .SHA256SUMS.asc file together.`,
);
