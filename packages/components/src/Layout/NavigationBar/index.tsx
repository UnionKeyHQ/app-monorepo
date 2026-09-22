import { useIsVerticalLayout } from '@unionkeyhq/components';

import DesktopLeftSideBar from './DesktopLeftSideBar';
import MobileBottomTabBar from './MobileBottomTabBar';

import type { BottomTabBarProps } from '../BottomTabs';

export default function NavigationBar(props: BottomTabBarProps) {
  const isSmallLayout = useIsVerticalLayout();

  if (isSmallLayout) {
    return <MobileBottomTabBar {...props} />;
  }
  return <DesktopLeftSideBar {...props} />;
}
