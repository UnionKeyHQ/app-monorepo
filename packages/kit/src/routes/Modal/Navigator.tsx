import { RootModalNavigator } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import type { EModalRoutes } from '@unionkeyhq/shared/src/routes';

import { modalRouter } from './router';

export function ModalNavigator() {
  return <RootModalNavigator<EModalRoutes> config={modalRouter} />;
}
