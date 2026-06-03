import type { IModalFlowNavigatorConfig } from '@unionkey/components/src/layouts/Navigation/Navigator';
import LazyLoad from '@unionkey/shared/src/lazyLoad';
import type { IModalShortcutsParamList } from '@unionkey/shared/src/routes/shortcuts';
import { EModalShortcutsRoutes } from '@unionkey/shared/src/routes/shortcuts';

const ShortcutsPreview = LazyLoad(
  () => import('@unionkey/kit/src/views/Shortcuts/pages/ShortcutsPreview'),
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
