# UnionKey dependency and service audit

Last reviewed: 2026-09-17

This document distinguishes UnionKey product identity from upstream attribution,
third-party package identity, persistent compatibility identifiers, and external
services. A remaining `OneKey` string is not automatically a branding defect.
It must be reviewed according to its actual role.

## Decision rules

1. Public UnionKey product names, links, support contacts and release metadata
   must use UnionKey-controlled identities.
2. Copyright notices, license text and truthful upstream attribution must not be
   removed or relabelled.
3. Third-party package names remain unchanged unless UnionKey owns and publishes
   a verified replacement package.
4. Persistent database keys, deep links and protocol fields require an explicit
   backward-compatible migration before they can be renamed.
5. External service URLs may be changed only after the replacement endpoint has
   been deployed and its API contract has been tested.

## Verified third-party packages

The license values below come from the installed package metadata for the pinned
versions in this repository.

| Package group | Pinned version | Declared license | Decision |
| --- | ---: | --- | --- |
| `@onekeyfe/cross-inpage-provider-*` | 1.1.59 | Apache-2.0 | Retain package identity and attribution |
| `@onekeyfe/extension-bridge-hosted` | 1.1.59 | Apache-2.0 | Retain until a tested UnionKey replacement exists |
| `@onekeyfe/onekey-cross-webview` | 1.1.59 | Apache-2.0 | Retain package identity and attribution |
| `@onekeyfe/hd-*` | 0.3.47 | ISC | Retain for hardware/firmware compatibility |
| `@onekeyfe/react-native-ble-plx` | 3.0.0 | Apache-2.0 | Retain or replace only after mobile regression testing |
| `@onekeyfe/cardano-coin-selection*` | 1.0.0/1.1.0 | MIT | Retain package identity and attribution |

The license files shipped by each dependency must remain in binary notices and
software-bill-of-materials output where required by its license.

## Git-hosted dependencies requiring provenance capture

The lockfile currently resolves the reviewed legacy forks to these commits:

| Dependency | Resolved commit |
| --- | --- |
| React Native WebView root override | `834d8096f8cfd78a961fb7a13f06f0cc64b2c9c3` |
| React Native animated charts | `f2b637d09b4f25f0a55f181e9ef926e5372bf1b0` |
| BitcoinJS fork | `234b061f93c77b178f93abfdca35fd9a067a4a30` |
| Coinselect fork | `91e8db20cf3464143cb9d404dee6de7fabb3b04a` |
| JCore React Native | `2cadf288224242cec715a2e260f872235c58874c` |
| JPush React Native | `f10dfb5fe18fc042e6d4a82ec12f6b1d431adac7` |
| React Native cloud filesystem | `450b00b11555e8e9523adf5c5d0726b5ae966d9e` |
| React Native nested scroll view | `934c32e47caecad93fc4abc5f28cc8bb29ecdaf6` |

The mobile workspace also references a separate React Native WebView branch;
its resolved commit must be captured from the lockfile before release.

Before a public release, record the exact resolved commit and license for each
dependency. Mirror only when the license permits redistribution, keep upstream
copyright notices, and pin the mirror to the same reviewed commit. Changing the
organization name without preserving provenance is not an acceptable migration.

## External service migration

| Service family | Current legacy hosts | Status | Required action |
| --- | --- | --- | --- |
| Public website/help/download | `onekey.so`, `help.onekey.so` | Migrated in public flows | Keep verified `unionkey.io` routes under monitoring |
| Static/token assets | `*.onekey-asset.com` | Legacy dependency | Deploy an owned asset mirror, verify hashes and then update URLs |
| Chain RPC | `node.onekey.so`, `rpc.onekey.so`, `fiat.onekeycn.com` | Blocking dependency | Deploy per-chain RPC routes and run chain-specific integration tests |
| Hardware SDK | `jssdk.onekey.so`, `jssdk.onekeycn.com` | Compatibility dependency | Host a licensed SDK build and test USB/BLE/firmware pairing |
| Firmware/update | `firmware.onekey.so`, `electron.onekey.so` | Blocking dependency | Publish signed UnionKey manifests and artifacts, then test signature verification |
| WalletConnect v1 | `walletconnectbridge.onekey.so` | Legacy compatibility | Replace with an operated compatible bridge or remove v1 after migration |
| Product APIs | `data`, `swap`, `portfolio`, `discover`, `ticket` hosts | Blocking dependency | Document API contracts and deploy UnionKey equivalents before switching |
| Test/sandbox hosts | `*.onekeytest.com` | Development dependency | Replace with isolated UnionKey staging services or remove dead fixtures |

## Compatibility identifiers retained intentionally

- The `OneKeyWallet` iOS project, target and directory names.
- Existing storage/database keys such as `OneKeyStorage`.
- Existing WalletConnect storage keys and legacy deep-link schemes.
- Hardware SDK types, command fields and device protocol identifiers.
- Historical test fixtures that represent previously received external data.

These identifiers are not UnionKey marketing claims. Renaming them without a
migration can break upgrades, lose user state, invalidate deep links or prevent
hardware communication.

## Release gate

A release is not considered infrastructure-independent until all blocking
service families above have verified UnionKey replacements. Each replacement
must include availability checks, contract tests, rollback instructions and an
identified operator. Desktop, Android and supported hardware signing flows must
then pass end-to-end tests without relying on an undocumented OneKey service.

## Firmware repository boundary

The firmware source is maintained separately at
`https://github.com/UnionKeyHQ/firmware` and is not covered by the application
baseline commit recorded here. It must not be described as independently
cleared by the application audit.

The firmware repository currently has two commits. Commit
`9552e66f9f5079e041d6e3b1fafbcaa08ca4c73c` imports 15,999 files with OneKey
identity. Commit `00da643ffea5d305322516e44f89cfb80dd4d1da` is titled
`Rebrand firmware to UnionKey`; it changes 1,093 files with approximately
87,172 insertions and 2,654 deletions, leaving 16,869 files in the tree. This
history must be disclosed accurately rather than characterized as an
independently created firmware codebase.

The firmware root license map declares GPL-3.0 for general files and `core` and
`storage`, LGPL-3.0 for `common`, `legacy` and `python`, and MIT for most of
`crypto`, with individual file headers taking precedence. Its submodules also
come from multiple upstream organizations. Distribution therefore requires
component-level notices and corresponding-source compliance, not merely a
UnionKey product-name change.

The firmware `SECURITY.md` currently advertises `dev@unionkey.so`, a UnionKey
BugRap bounty and the application repository, none of which is established by
the application security policy. It needs a verified security contact and a
firmware-specific disclosure policy before release.

Before distributing UnionKey Touch firmware, the firmware repository needs its
own recorded license-bearing base commit, upstream attribution, post-baseline
diff review, submodule license inventory, reproducible build instructions and
proof that UnionKey controls the release-signing keys. Product-string changes do
not establish redistribution rights or source independence.
