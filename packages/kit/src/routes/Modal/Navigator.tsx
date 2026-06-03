import { RootModalNavigator } from '@unionkey/components/src/layouts/Navigation/Navigator';
import type { EModalRoutes } from '@unionkey/shared/src/routes';

import { modalRouter } from './router';

export function ModalNavigator() {
  return <RootModalNavigator<EModalRoutes> config={modalRouter} />;
}
