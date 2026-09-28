/* eslint-disable no-var,vars-on-top */
import type { LocaleIds } from '@unionkeyhq/components/src/locale';
import type { IBackgroundApi } from '@unionkeyhq/kit-bg/src/IBackgroundApi';

import type { JsBridgeBase } from '@unionkeyhq/cross-inpage-provider-core';
import type { ProviderPrivate } from '@unionkeyhq/unionkey-private-provider';
import type { EnhancedStore } from '@reduxjs/toolkit';
import type WebView from 'react-native-webview';

declare const self: ServiceWorkerGlobalScope;

type IWindowUnionKeyHub = {
  $private: ProviderPrivate;
};
declare global {
  // eslint-disable-next-line
  // var onekey: WindowUnionKey;

  var $appIsReduxReady: boolean;
  var $onekey: IWindowUnionKeyHub;
  var $backgroundApiProxy: IBackgroundApi;
  var $backgroundApi: IBackgroundApi;

  var $$navigationShortcuts: any;
  var $$simpleDb: any;
  var $$appEventBus: any;
  var $$appUIEventBus: any;
  var $$appStore: EnhancedStore;
  var $$appDispatch: any;
  var $$appSelector: any;
  var $$appStorage: any;
  var $$platformEnv: any;
  var $$debugLogger: any;
  var $$localforage: any;
  var $$navigationActions: any;
  var $$wcTransports: any;
  var $$unionKeyDisabledSetTimeout: boolean | undefined;
  var $$unionKeyDisabledSetInterval: boolean | undefined;
  var $$unionKeyPerfTrace:
    | {
        log: (options: { name: string; payload?: any }) => void;
        timeline: Array<{
          time: string;
          elapsed: number;
          lag: number;
          name: string;
          payload?: any;
        }>;
      }
    | undefined;

  var chrome: typeof chrome; // chrome api
  var browser: typeof chrome; // firefox api

  interface Window {
    // All website
    ethereum: any;
    web3: any;
    $onekey: IWindowUnionKeyHub;

    // Native App webview content
    ReactNativeWebView: WebView;

    // Desktop internal (main,renderer)
    UNIONKEY_DESKTOP_GLOBALS: Record<string, any>;

    // Ext internal (ui,background,contentScript)
    extJsBridgeUiToBg: JsBridgeBase;
    extJsBridgeOffscreenToBg: JsBridgeBase;
    UNIONKEY_DESKTOP_DEEP_LINKS: any[];
  }
}

declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: LocaleIds;
    }
  }
}
