import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import LazyLoad from '@unionkeyhq/shared/src/lazyLoad';
import type { IModalShortcutsParamList } from '@unionkeyhq/shared/src/routes/shortcuts';
import { EModalShortcutsRoutes } from '@unionkeyhq/shared/src/routes/shortcuts';

const ShortcutsPreview = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/Shortcuts/pages/ShortcutsPreview'),
);

export const ShortcutsModalRouter: IModalFlowNavigatorConfig<
  EModalShortcutsRoutes,
  IModalShortcutsParamList
>[] = [
  {
    name: EModalShortcutsRoutes.ShortcutsPreview,
    component: ShortcutsPreview,
  },
];
