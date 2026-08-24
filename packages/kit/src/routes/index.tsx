import type { IRootStackNavigatorConfig } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import { RootStackNavigator } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import type { ERootRoutes } from '@unionkeyhq/shared/src/routes';

export function RootNavigator({
  config,
}: {
  config: IRootStackNavigatorConfig<ERootRoutes, any>[];
}) {
  return <RootStackNavigator config={config} />;
}
