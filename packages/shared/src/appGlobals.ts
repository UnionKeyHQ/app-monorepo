/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { IToast } from '@unionkeyhq/components';
import type { IAppNavigation } from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import type BackgroundApi from '@unionkeyhq/kit-bg/src/apis/BackgroundApi';
import type BackgroundApiProxy from '@unionkeyhq/kit-bg/src/apis/BackgroundApiProxy';
import type { LocalDbBase } from '@unionkeyhq/kit-bg/src/dbs/local/LocalDbBase';
import type {
  EIndexedDBBucketNames,
  IIndexedDBSchemaMap,
} from '@unionkeyhq/kit-bg/src/dbs/local/types';
import type { IOffscreenApi } from '@unionkeyhq/kit-bg/src/offscreens/instance/IOffscreenApi';
import type { JotaiBgSync } from '@unionkeyhq/kit-bg/src/states/jotai/jotaiBgSync';
import type { IWebembedApi } from '@unionkeyhq/kit-bg/src/webembeds/instance/IWebembedApi';
import type { Analytics } from '@unionkeyhq/shared/src/analytics';
import type { DefaultLogger } from '@unionkeyhq/shared/src/logger/logger';

import type { IAppDeviceInfo } from './appDeviceInfo/types';
import type { AppEventBusClass } from './eventBus/appEventBus';
import type { IndexedDBPromised } from './IndexedDBPromised';
import type { IAppStorage } from './storage/syncStorage';
import type { JsBridgeBase } from '@onekeyfe/cross-inpage-provider-core';
import type { NavigationContainerRef } from '@react-navigation/native';
import type Realm from 'realm';

export type IAppGlobals = {
  $backgroundApiProxy: BackgroundApiProxy;
  $$backgroundApi: BackgroundApi; // not available for ext ui
  $offscreenApiProxy: IOffscreenApi;
  $webembedApiProxy: IWebembedApi;
  $navigationRef: React.RefObject<NavigationContainerRef<any>>;
  $defaultLogger?: DefaultLogger;
  $Toast?: IToast;
  $appStorage?: IAppStorage;
  $appEventBus?: AppEventBusClass;
  // Ext internal (ui,background,contentScript)
  extJsBridgeUiToBg: JsBridgeBase;
  extJsBridgeOffscreenToBg: JsBridgeBase;
  //
  $rootAppNavigation?: IAppNavigation | undefined;
  $$scanNavigation?: IAppNavigation | undefined;
  $jotaiBgSync?: JotaiBgSync | undefined;
  $analytics?: Analytics | undefined;
  $$jotaiContextStore?: any;
  $$jotaiContextStorePrint?: any;
  $$allAtoms?: any; // jotai global atoms
  $$simpleDb?: any;
  $$simpleDbV4?: any;
  $$localDb?: LocalDbBase;
  $$localDbV4?: any;
  $$realm?: Realm;
  $$realmV4?: Realm;
  $$localforage?: any;
  $$platformEnv?: any;
  $$errorUtils?: any;
  $$appDeviceInfo?: IAppDeviceInfo;
  $$indexedDBBuckets?: Record<
    EIndexedDBBucketNames,
    IndexedDBPromised<IIndexedDBSchemaMap>
  >;
};

const appGlobals: IAppGlobals = {
  $backgroundApiProxy: undefined!,
  $$backgroundApi: undefined!,
  $offscreenApiProxy: undefined!,
  $webembedApiProxy: undefined!,
  $navigationRef: undefined!,
  extJsBridgeUiToBg: undefined!,
  extJsBridgeOffscreenToBg: undefined!,
};

if (process.env.NODE_ENV !== 'production') {
  globalThis.$$appGlobals = appGlobals;
}

export default appGlobals;
