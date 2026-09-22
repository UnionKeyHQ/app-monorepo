# UnionKey migration baseline

This branch starts from OneKeyHQ/app-monorepo commit
`33c108341568ba7733f3227554ca7b35f14f1901`, dated 2024-05-10. The repository
root at that commit contains the Apache License, Version 2.0.

## Migration rules

- Preserve the root Apache-2.0 license and all applicable upstream copyright,
  patent, trademark, and attribution notices.
- Mark UnionKey modifications in commits and release documentation.
- Treat the working UnionKey 6.0.0 application as a behavior and UI reference.
- Port later source only when its ownership or distribution permission is
  independently established.
- Audit dependencies, bundled binaries, fonts, images, animations, firmware,
  and hosted services separately from the root source license.
- Keep test data isolated from existing production wallet data.

## First functional checkpoint

The first checkpoint keeps the existing 4.24.0 wallet implementation and
verifies its original flow: onboarding, password setup, mnemonic generation or
import, encrypted wallet persistence, restart, and unlock. Hardware-wallet
integration is handled after software-wallet persistence passes on desktop and
Android.
