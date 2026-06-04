# `@unionkeyfe/hd-web-sdk`

`@unionkeyfe/hd-web-sdk` is a browser implementation of hardware-sdk that creates an iframe and communicates with transport through the iframe to avoid cross-domain issues.

## Installation

Install library as npm module:

```javascript
npm install @unionkeyfe/hd-web-sdk
```

or

```javascript
yarn add @unionkeyfe/hd-web-sdk
```

## Initialization

```javascript
import { HardwareSDK } from '@unionkeyfe/hd-web-sdk';

function init() {
  HardwareSDK.init({
    debug: false,
    connectSrc: 'https://jssdk.unionkeycn.com/'
  });
}
```

## Docs

Documentation is available at [UnionKey hardware-js-sdk](https://github.com/UnionKeyHQ/hardware-js-sdk).
