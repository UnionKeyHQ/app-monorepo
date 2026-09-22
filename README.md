# UnionKey App

UnionKey is a self-custody wallet application for managing digital assets and
using supported Web3 services. It provides desktop, mobile, browser-extension,
and web interfaces, including integration with supported hardware wallets.

Private keys remain under the user's control. Hardware-wallet private keys are
generated and stored on the device and are not exposed to the application.

## Downloads

- [Mobile](https://unionkey.io/mobile)
- [Desktop](https://unionkey.io/desktop)
- [GitHub releases](https://github.com/UnionKeyHQ/app-monorepo/releases)

Only download UnionKey from the official website or the official UnionKeyHQ
GitHub organization. Verify release checksums before installing packages.

## Development

This repository is a Yarn workspace monorepo. See the scripts in
[`package.json`](./package.json) for the supported development, test, and build
commands.

Please report product bugs through the
[UnionKey issue tracker](https://github.com/UnionKeyHQ/app-monorepo/issues).
Security vulnerabilities must be reported privately according to
[`SECURITY.md`](./SECURITY.md).

## License and attribution

This migration is based on an Apache-2.0-licensed historical version of the
upstream project. See [`LICENSE`](./LICENSE), [`NOTICE`](./NOTICE), and
[`MIGRATION_BASELINE.md`](./MIGRATION_BASELINE.md) for license terms,
attribution, and the exact migration baseline.

Third-party package names, protocol identifiers, hardware compatibility names,
and historical attribution may retain their original names where changing them
would be inaccurate or break interoperability.
