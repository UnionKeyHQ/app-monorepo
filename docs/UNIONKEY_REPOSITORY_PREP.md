# UnionKey Repository Prep

This document tracks the external repositories/packages that must be owned by
UnionKey before the app can fully move away from OneKey-hosted dependencies.

## Current App Repository

- GitHub: `https://github.com/zyfshr/app-monorepo.git`
- Working branch: `codex/unionkey-rebrand`
- Future canonical repo suggestion: `UnionKeyHQ/app-monorepo`

## Repositories To Create Or Fork

These repositories are referenced directly from package manifests or are needed
to replace direct `@onekeyfe` package usage.

| Repo | Source | Why it is needed |
| --- | --- | --- |
| `UnionKeyHQ/app-monorepo` | `zyfshr/app-monorepo` | Canonical UnionKey wallet monorepo. |
| `UnionKeyHQ/cross-inpage-provider` | `OneKeyHQ/cross-inpage-provider` | Own inpage provider packages and remove `@onekeyfe/cross-inpage-provider-*`. |
| `UnionKeyHQ/hardware-js-sdk` | `OneKeyHQ/hardware-js-sdk` | Own hardware SDK packages and remove `@onekeyfe/hd-*`. |
| `UnionKeyHQ/onekey-cross-webview` | `OneKeyHQ/onekey-cross-webview` | Own webview bridge package currently published as `@onekeyfe/onekey-cross-webview`. |
| `UnionKeyHQ/react-native-webview` | `OneKeyHQ/react-native-webview` | Own `react-native-webview` npm alias currently pointing at `@onekeyfe/react-native-webview`. |
| `UnionKeyHQ/react-native-webview-cleaner` | `OneKeyHQ/react-native-webview-cleaner` | Own `react-native-webview-cleaner` npm alias. |
| `UnionKeyHQ/react-native-cloud-fs` | `OneKeyHQ/react-native-cloud-fs` | Own mobile cloud filesystem dependency. |
| `UnionKeyHQ/react-native-animated-charts` | `OneKeyHQ/react-native-animated-charts` | Own mobile chart native dependency. |
| `UnionKeyHQ/react-native-ble-utils` | `OneKeyHQ/react-native-ble-utils` | Own BLE native helper used by hardware SDK/mobile. |
| `UnionKeyHQ/react-native-lite-card` | `OneKeyHQ/react-native-lite-card` | Own lite card native dependency. |
| `UnionKeyHQ/react-native-tab-page-view` | `OneKeyHQ/react-native-tab-page-view` | Own tab page native dependency. |
| `UnionKeyHQ/react-native-text-input` | `OneKeyHQ/react-native-text-input` | Own text input native dependency. |
| `UnionKeyHQ/jcore-react-native` | existing package URL | Already referenced by the app; repo must exist at this URL. |
| `UnionKeyHQ/jpush-react-native` | existing package URL | Already referenced by the app; repo must exist at this URL. |
| `UnionKeyHQ/react-native-nested-scroll-view` | existing package URL | Already referenced by the app; repo must exist at this URL. |

## Recommended Migration Order

1. Create or fork the GitHub repositories above under `UnionKeyHQ`.
2. Keep package names stable at first if a dependency has deep transitive
   references to `@onekeyfe/*`; change the repository ownership first.
3. Publish UnionKey-scoped npm packages only after each fork builds on its own.
4. Update this monorepo dependency declarations from `@onekeyfe/*` to the new
   package names or npm aliases.
5. Run `yarn install`, `copy:inject`, desktop dev startup, and mobile install
   checks after each dependency family.

## Command Helper

Run this from the monorepo root to print GitHub CLI commands:

```powershell
node development/scripts/prepare_unionkey_repos.js
```

The script does not create anything by default. After GitHub CLI is installed
and authenticated, rerun with:

```powershell
node development/scripts/prepare_unionkey_repos.js --gh
```

Then review and run the printed commands.

If the repositories are being prepared under the logged-in personal account
instead of the future `UnionKeyHQ` organization, use:

```powershell
$env:UNIONKEY_GITHUB_OWNER='zyfshr'
node development/scripts/prepare_unionkey_repos.js --personal --gh
```

To check whether the repos already exist:

```powershell
node development/scripts/prepare_unionkey_repos.js --check
```

The canonical repo/package mapping lives in:

```text
development/unionkey/external-repos.json
```

After the UnionKey packages have been published, preview the package manifest
migration with:

```powershell
node development/scripts/migrate_unionkey_dependencies.js
```

Apply it with:

```powershell
node development/scripts/migrate_unionkey_dependencies.js --write
node .yarn/releases/yarn-4.1.0.cjs install
```

## Current Blocking Notes

- `UnionKeyHQ` repositories have been prepared. See
  `development/unionkey/created-repos.unionkeyhq.json`.
- `zyfshr` repositories were also prepared during the first setup pass before
  the organization existed. See `development/unionkey/created-repos.zyfshr.json`.
- Several generated bundles may still contain OneKey strings until the external
  injected provider and hardware SDK packages are forked and rebuilt.
- `UnionKeyHQ/onekey-cross-webview` and
  `UnionKeyHQ/react-native-text-input` are private empty placeholder repos
  because the matching `OneKeyHQ/*` source repos returned 404.
