import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import type { IPageFooterProps } from '@unionkeyhq/components';
import { Page, YStack } from '@unionkeyhq/components';
import {
  useAppUpdateInfo,
  useDownloadPackage,
} from '@unionkeyhq/kit/src/components/UpdateReminder/hooks';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { EAppUpdateStatus } from '@unionkeyhq/shared/src/appUpdate';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { EAppUpdateRoutes } from '@unionkeyhq/shared/src/routes/appUpdate';
import { openUrlExternal } from '@unionkeyhq/shared/src/utils/openUrlUtils';

import type { IUpdatePreviewActionButton } from './type';

export const UpdatePreviewActionButton: IUpdatePreviewActionButton = ({
  isForceUpdate,
}: {
  isForceUpdate?: boolean;
}) => {
  const intl = useIntl();
  const appUpdateInfo = useAppUpdateInfo();

  const navigation = useAppNavigation();

  const { downloadPackage } = useDownloadPackage();

  const handleToUpdate: IPageFooterProps['onConfirm'] = useCallback(() => {
    if (appUpdateInfo.data) {
      if (appUpdateInfo.data.storeUrl) {
        openUrlExternal(appUpdateInfo.data.storeUrl);
      } else if (appUpdateInfo.data.downloadUrl) {
        if (appUpdateInfo.data.status === EAppUpdateStatus.notify) {
          void downloadPackage();
        }
        navigation.push(EAppUpdateRoutes.DownloadVerify, {
          isForceUpdate,
        });
      }
    }
  }, [appUpdateInfo.data, downloadPackage, isForceUpdate, navigation]);
  return (
    <Page.Footer>
      <YStack>
        <Page.FooterActions
          onConfirmText={intl.formatMessage({
            id: appUpdateInfo.data.storeUrl
              ? ETranslations.update_update_now
              : ETranslations.update_download_and_verify_text,
          })}
          onConfirm={handleToUpdate}
        />
      </YStack>
    </Page.Footer>
  );
};
