/* eslint-disable @typescript-eslint/no-unused-vars, import/first, import/order */
import '@unionkeyhq/shared/src/polyfills';

import { KitProvider } from '@unionkeyhq/kit';
import { withSentryHOC } from '@unionkeyhq/shared/src/modules3rdParty/sentry';
import { SentryErrorBoundaryFallback } from '@unionkeyhq/kit/src/components/ErrorBoundary';

export default withSentryHOC(KitProvider, SentryErrorBoundaryFallback);
