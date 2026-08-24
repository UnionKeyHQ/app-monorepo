/* eslint-disable import/first */
/* eslint-disable import/order */
const {
  markJsBundleLoadedTime,
} = require('@unionkeyhq/shared/src/modules3rdParty/metrics');

markJsBundleLoadedTime();

import '@unionkeyhq/shared/src/polyfills';
import { registerRootComponent } from 'expo';

import App from './App';

import {
  initSentry,
  withSentryHOC,
} from '@unionkeyhq/shared/src/modules3rdParty/sentry';
import { SentryErrorBoundaryFallback } from '@unionkeyhq/kit/src/components/ErrorBoundary';

initSentry();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(withSentryHOC(App, SentryErrorBoundaryFallback));
