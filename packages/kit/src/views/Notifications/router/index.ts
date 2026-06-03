import type { IModalFlowNavigatorConfig } from '@unionkey/components';
import { LazyLoadPage } from '@unionkey/kit/src/components/LazyLoadPage';
import type { IModalNotificationsParamList } from '@unionkey/shared/src/routes/notifications';
import { EModalNotificationsRoutes } from '@unionkey/shared/src/routes/notifications';

const NotificationList = LazyLoadPage(
  () => import('@unionkey/kit/src/views/Notifications/pages/NotificationList'),
);

const NotificationIntroduction = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/Notifications/pages/NotificationIntroduction'
    ),
);

export const ModalNotificationsRouter: IModalFlowNavigatorConfig<
  EModalNotificationsRoutes,
  IModalNotificationsParamList
>[] = [
  {
    name: EModalNotificationsRoutes.NotificationList,
    component: NotificationList,
  },

  {
    name: EModalNotificationsRoutes.NotificationIntroduction,
    component: NotificationIntroduction,
  },
];
