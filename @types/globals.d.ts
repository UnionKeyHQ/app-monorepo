/* eslint-disable no-var,vars-on-top */

import type { ICheckCurrentDBIsMigratedToBucketResult } from '@unionkey/kit-bg/src/migrations/indexedToBucketsMigration/indexedToBucketsMigration';
import type {
  ETranslations,
  ETranslationsMock,
} from '@unionkey/shared/src/locale';
import type { IWebEmbedUnionkeyAppSettings } from '@unionkey/web-embed/utils/webEmbedAppSettings';

import type { ProviderPrivate } from '@unionkeyfe/onekey-private-provider';

type IWindowUnionKeyHub = {
  $private: ProviderPrivate & {
    webembedReceiveHandler: (payload: IJsBridgeMessagePayload) => Promise<any>;
  };
};

type IUnionKeyPerfTrace = {
  log: (options: { name: string; payload?: any }) => void;
  timeline: Array<{
    time: string;
    elapsed: number;
    lag: number;
    name: string;
    payload?: any;
  }>;
};

declare global {
  var $$appGlobals: IAppGlobals;
  var $unionkeySystemDiskIsFull: boolean | undefined;
  var $indexedDBIsMigratedToBucket:
    | ICheckCurrentDBIsMigratedToBucketResult
    | undefined;

  // eslint-disable-next-line
  // var unionkey: WindowUnionKey;
  var $unionkey: IWindowUnionKeyHub;
  var $unionkeyAppWebembedApiWebviewInitFailed: boolean | undefined;

  var $$unionkeyDisabledSetTimeout: boolean | undefined;
  var $$unionkeyDisabledSetInterval: boolean | undefined;

  // defined in preload-html-head.js, check ext html bootstrap timeline:
  //      window.$$unionkeyPerfTrace.timeline
  var $$unionkeyPerfTrace: IUnionKeyPerfTrace | undefined;

  var chrome: typeof chrome; // chrome api
  var browser: typeof chrome; // firefox api

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    // All website
    ethereum: any;
    web3: any;
    $unionkey: IWindowUnionKeyHub;

    // Desktop internal (main,renderer)
    // UNIONKEY_DESKTOP_GLOBALS: Record<any, any>;

    UNIONKEY_DESKTOP_DEEP_LINKS: any[];
  }

  // All website
  var ethereum: any;
  var web3: any;
  var $unionkey: IWindowUnionKeyHub;

  // Native App webview content
  var ReactNativeWebView: WebView;

  // Desktop internal (main,renderer)
  var UNIONKEY_DESKTOP_GLOBALS: Record<any, any>;

  // Ext internal (ui,background,contentScript)
  var extJsBridgeUiToBg: JsBridgeBase;
  var extJsBridgeOffscreenToBg: JsBridgeBase;
  var UNIONKEY_DESKTOP_DEEP_LINKS: any[];

  var WEB_EMBED_UNIONKEY_APP_SETTINGS: IWebEmbedUnionkeyAppSettings | undefined;

  // Added for webpack/bundler injected variables
  var __CURRENT_FILE_PATH__: string | undefined;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Error extends Error {
    $$autoPrintErrorIgnore?: boolean;
    $$autoToastErrorTriggered?: boolean;
  }
}

declare const self: ServiceWorkerGlobalScope;

declare global {
  namespace FormatjsIntl {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Message {
      ids: ETranslations | ETranslationsMock;
    }
  }
}

declare global {
  interface IStorageBucketOptions {
    durability?: 'strict' | 'relaxed';
    persisted?: boolean;
  }

  interface IStorageBucket {
    indexedDB: IDBFactory;
  }

  interface IStorageBucketManager {
    open(
      name: string,
      options?: IStorageBucketOptions,
    ): Promise<IStorageBucket>;
    keys(): Promise<string[]>;
    delete(name: string): Promise<void>;
  }

  interface INavigator extends Navigator {
    storageBuckets?: IStorageBucketManager;
  }

  var navigator: INavigator!;
}
