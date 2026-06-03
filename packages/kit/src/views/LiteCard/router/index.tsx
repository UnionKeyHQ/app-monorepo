import type { IModalFlowNavigatorConfig } from '@unionkey/components/src/layouts/Navigation/Navigator';
import LazyLoad from '@unionkey/shared/src/lazyLoad';
import { ETranslations } from '@unionkey/shared/src/locale';
import { ELiteCardRoutes } from '@unionkey/shared/src/routes';
import type { ILiteCardParamList } from '@unionkey/shared/src/routes';

const LiteCardHome = LazyLoad(
  () => import('@unionkey/kit/src/views/LiteCard/pages/Home'),
);

const LiteCardSelectWallet = LazyLoad(
  () => import('@unionkey/kit/src/views/LiteCard/pages/SelectWallet'),
);

export const LiteCardPages: IModalFlowNavigatorConfig<
  ELiteCardRoutes,
  ILiteCardParamList
>[] = [
  {
    name: ELiteCardRoutes.LiteCardHome,
    component: LiteCardHome,
    translationId: ETranslations.global_unionkey_lite,
  },
  {
    name: ELiteCardRoutes.LiteCardSelectWallet,
    component: LiteCardSelectWallet,
    translationId: ETranslations.settings_select_wallet,
  },
];
