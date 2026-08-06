const DLLs = require('./electron-dll.config');
const baseElectronBuilderConfig = require('./electron-builder-base.config');

const certificateSha1 = process.env.WIN_CSC_SHA1?.trim();
const publisherName = process.env.WINDOWS_PUBLISHER_NAME?.trim();
const windowsArchitectures = (
  process.env.WINDOWS_RELEASE_ARCHES || 'x64,arm64'
)
  .split(',')
  .map((arch) => arch.trim())
  .filter((arch) => ['x64', 'arm64'].includes(arch));

module.exports = {
  ...baseElectronBuilderConfig,
  asarUnpack: [
    '**/node_modules/@stoprocent/noble/**/*',
    '**/node_modules/@stoprocent/bluetooth-hci-socket/**',
  ],

  nsis: {
    oneClick: false,
    installerSidebar: 'app/build/static/images/icons/installerSidebar.bmp',
    deleteAppDataOnUninstall: true,
  },
  win: {
    extraResources: [
      {
        from: 'app/build/static/bin/bridge/win-${arch}',
        to: 'bin/bridge',
      },
    ],
    extraFiles: DLLs,
    icon: 'app/build/static/images/icons/512x512.png',
    artifactName: 'UnionKey-Wallet-${version}-win-${arch}.${ext}',
    forceCodeSigning: process.env.REQUIRE_WINDOWS_CODE_SIGNING === '1',
    verifyUpdateCodeSignature: true,
    ...((certificateSha1 || publisherName) && {
      signtoolOptions: {
        ...(certificateSha1 ? { certificateSha1 } : {}),
        ...(publisherName ? { publisherName: [publisherName] } : {}),
      },
    }),
    target: [{ target: 'nsis', arch: windowsArchitectures }],
  },
};
