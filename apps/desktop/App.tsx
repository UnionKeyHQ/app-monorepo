/* eslint-disable @typescript-eslint/no-unused-vars, import/first, import/order */
import '@unionkey/shared/src/polyfills';
import '@unionkey/shared/src/web/index.css';

import { KitProvider } from '@unionkey/kit';

import {
  initSentry,
  withSentryHOC,
} from '@unionkey/shared/src/modules3rdParty/sentry';
import { SentryErrorBoundaryFallback } from '@unionkey/kit/src/components/ErrorBoundary';

initSentry();

export default withSentryHOC(KitProvider, SentryErrorBoundaryFallback);
// export default KitProvider;
