/* eslint-disable @typescript-eslint/no-unused-vars, import/first, import/order */
import '@unionkey/shared/src/polyfills';

import { KitProvider } from '@unionkey/kit';
import { withSentryHOC } from '@unionkey/shared/src/modules3rdParty/sentry';
import { SentryErrorBoundaryFallback } from '@unionkey/kit/src/components/ErrorBoundary';

export default withSentryHOC(KitProvider, SentryErrorBoundaryFallback);
