import type { IRootStackNavigatorConfig } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import { RootStackNavigator } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';

import DemoModalStackScreen from './Modal';
import { EDemoRootRoutes } from './Routes';
import Tab from './Tab/DemoTabNavigator';

const rootConfig: IRootStackNavigatorConfig<EDemoRootRoutes, any>[] = [
  {
    name: EDemoRootRoutes.Main,
    component: Tab,
    initialRoute: true,
  },
  {
    name: EDemoRootRoutes.Modal,
    component: DemoModalStackScreen,
    type: 'modal',
  },
];

export const DemoRootApp = () => (
  <RootStackNavigator<EDemoRootRoutes, any> config={rootConfig} />
);
