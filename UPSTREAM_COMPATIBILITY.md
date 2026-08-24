# Upstream compatibility boundaries

UnionKey-owned product names, package scopes, application identifiers, domains,
release artifacts, native projects, and public documentation use the UnionKey
identity.

This repository still consumes third-party packages published under the
`@onekeyfe/*` namespace. Some of those packages expose fixed API and protocol
identifiers such as `showOnOneKey`, `txToOneKey`, `ONEKEY_WEBUSB_FILTER`, and the
injected `$onekey` provider. These identifiers must remain unchanged at the
dependency boundary until the corresponding packages and protocols are forked,
renamed, published, and adopted together. Renaming them only inside this
repository breaks hardware communication or dApp provider compatibility.

Several legacy persistence identifiers are also retained so an upgrade can read
existing local databases, cloud backups, and hardware metadata. They are data
compatibility keys, not user-facing branding.

The existing license file records the upstream licensor and its terms. It must
not be removed or rewritten as part of a branding migration. A public UnionKey
release requires separate authorization from the rights holder or a valid
replacement license covering redistribution and derivative releases.
