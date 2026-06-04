# UnionKey Wallet

Open-source crypto wallet for desktop, mobile, browser extension, and web.

[![GitHub Stars](https://img.shields.io/github/stars/UnionKeyHQ/app-monorepo?t&logo=github&style=for-the-badge&labelColor=000)](https://github.com/UnionKeyHQ/app-monorepo/stargazers)
[![Version](https://img.shields.io/github/release/UnionKeyHQ/app-monorepo.svg?style=for-the-badge&labelColor=000)](https://github.com/UnionKeyHQ/app-monorepo/releases)
[![Contributors](https://img.shields.io/github/contributors-anon/UnionKeyHQ/app-monorepo?style=for-the-badge&labelColor=000)](https://github.com/UnionKeyHQ/app-monorepo/graphs/contributors)
[![Last Commit](https://img.shields.io/github/last-commit/UnionKeyHQ/app-monorepo.svg?style=for-the-badge&labelColor=000)](https://github.com/UnionKeyHQ/app-monorepo/commits/main)
[![Issues](https://img.shields.io/github/issues-raw/UnionKeyHQ/app-monorepo.svg?style=for-the-badge&labelColor=000)](https://github.com/UnionKeyHQ/app-monorepo/issues?q=is%3Aissue+is%3Aopen)
[![Pull Requests](https://img.shields.io/github/issues-pr-raw/UnionKeyHQ/app-monorepo.svg?style=for-the-badge&labelColor=000)](https://github.com/UnionKeyHQ/app-monorepo/pulls?q=is%3Apr+is%3Aopen)

## Downloads

- [Desktop clients: macOS, Windows, and Linux](https://unionkey.so/zh_CN/download?client=desktop)
- [Browser extensions: Chrome, Firefox, Edge, and Brave](https://unionkey.so/zh_CN/download?client=browserExtension)
- [Bridge](https://unionkey.so/zh_CN/download?client=bridge)
- [iOS App Store](https://apps.apple.com/us/app/unionkey-open-source-wallet/id1609559473)
- [Google Play](https://play.google.com/store/apps/details?id=so.unionkey.app.wallet)

## Documentation

- [Deepwiki](https://deepwiki.com/UnionKeyHQ/app-monorepo)
- [Bug bounty rules](https://github.com/UnionKeyHQ/app-monorepo/blob/main/docs/BUG_RULES.md)

## Support

- [Community Forum](https://github.com/orgs/UnionKeyHQ/discussions): help with building, usage, and best practices.
- [GitHub Issues](https://github.com/UnionKeyHQ/app-monorepo/issues): bugs and errors you encounter using UnionKey.

## Repo Status

Public and production-ready.

We appreciate your support. Star or watch this repo for the latest UnionKey updates.

## Getting Started

1. Install [Node.js LTS](https://nodejs.org/en/).
2. Install [Yarn](https://yarnpkg.com/).
3. Install [Git LFS](https://git-lfs.github.com/), which is required for pulling and updating some binaries.
4. For iOS development, use Xcode 13.3 or newer.
5. For Android development, use JDK 11 or newer.

After pulling the latest code, install dependencies from the repository root:

```bash
yarn
```

## Development

Run these commands from the repository root:

- `yarn app:web`: develop web mode with a local static server on port 3000.
- `yarn app:ios`: run iOS development on a USB-connected iPhone.
- `yarn app:android`: run Android development.
- `yarn app:desktop`: run desktop development.
- `yarn app:ext`: run browser extension development.

## Localized Docs

| Language |
| :-- |
| [Simplified Chinese](docs/i18n/README.zh-cn.md) |
| [German / Deutsch](docs/i18n/README.de.md) |
| [Japanese](docs/i18n/README.jp.md) |
| [French / Francais](docs/i18n/README.fr.md) |
| [Italian / Italiano](docs/i18n/README.it.md) |

## Security

- Please report suspected security vulnerabilities privately to dev@unionkey.so.
- Please do not create public issues for suspected security vulnerabilities.
- As an open-source project, we try to reward white-hat researchers who responsibly disclose vulnerabilities in a timely manner.

## Contributors

[![Contributors](https://img.shields.io/github/contributors-anon/UnionKeyHQ/app-monorepo?style=for-the-badge&labelColor=000)](https://github.com/UnionKeyHQ/app-monorepo/graphs/contributors)

<a href="https://github.com/UnionKeyHQ/app-monorepo/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=UnionKeyHQ/app-monorepo&max=240&columns=24" alt="UnionKey contributors"/>
</a>
