import type { IRootStackNavigatorConfig } from '@unionkey/components/src/layouts/Navigation/Navigator';
import { RootStackNavigator } from '@unionkey/components/src/layouts/Navigation/Navigator';
import type { ERootRoutes } from '@unionkey/shared/src/routes';

export function RootNavigator({
  config,
}: {
  config: IRootStackNavigatorConfig<ERootRoutes, any>[];
}) {
  return <RootStackNavigator config={config} />;
}
