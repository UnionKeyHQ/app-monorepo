import type { IModalFlowNavigatorConfig } from '@unionkey/components/src/layouts/Navigation/Navigator';
import LazyLoad from '@unionkey/shared/src/lazyLoad';
import { EModalKeyTagRoutes } from '@unionkey/shared/src/routes';
import type { IModalKeyTagParamList } from '@unionkey/shared/src/routes';

const BackupWallet = LazyLoad(
  () => import('@unionkey/kit/src/views/KeyTag/pages/BackupWallet'),
);

const UserOptions = LazyLoad(
  () => import('@unionkey/kit/src/views/KeyTag/pages/UserOptions'),
);

const BackupDotMap = LazyLoad(
  () => import('@unionkey/kit/src/views/KeyTag/pages/BackupDotMap'),
);

const BackupRecoveryPhrase = LazyLoad(
  () => import('@unionkey/kit/src/views/KeyTag/pages/BackupRecoveryPhrase'),
);

const BackupDocs = LazyLoad(
  () => import('@unionkey/kit/src/views/KeyTag/pages/BackupDocs'),
);

export const KeyTagModalRouter: IModalFlowNavigatorConfig<
  EModalKeyTagRoutes,
  IModalKeyTagParamList
>[] = [
  {
    name: EModalKeyTagRoutes.BackupWallet,
    component: BackupWallet,
  },
  {
    name: EModalKeyTagRoutes.UserOptions,
    component: UserOptions,
  },
  {
    name: EModalKeyTagRoutes.BackupDotMap,
    component: BackupDotMap,
  },
  {
    name: EModalKeyTagRoutes.BackupRecoveryPhrase,
    component: BackupRecoveryPhrase,
  },
  {
    name: EModalKeyTagRoutes.BackupDocs,
    component: BackupDocs,
  },
];
