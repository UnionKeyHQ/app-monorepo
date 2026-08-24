/* eslint-disable @typescript-eslint/no-unused-vars, import/first, import/order */
import '@unionkeyhq/shared/src/polyfills';
import '@unionkeyhq/shared/src/web/index.css';

import { KitProvider } from '@unionkeyhq/kit';

import {
  initSentry,
  withSentryHOC,
} from '@unionkeyhq/shared/src/modules3rdParty/sentry';
import { SentryErrorBoundaryFallback } from '@unionkeyhq/kit/src/components/ErrorBoundary';

initSentry();

export default withSentryHOC(KitProvider, SentryErrorBoundaryFallback);
// export default KitProvider;
