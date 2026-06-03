import { useMemo } from 'react';

import { useIntl } from 'react-intl';

import { Image, Page, SizableText, YStack } from '@unionkey/components';
import { useDownloadPackage } from '@unionkey/kit/src/components/UpdateReminder/hooks';
import { ETranslations } from '@unionkey/shared/src/locale';
import platformEnv from '@unionkey/shared/src/platformEnv';

export default function ManualInstall() {
  const intl = useIntl();

  const { manualInstallPackage } = useDownloadPackage();

  const descTranslationId = useMemo(() => {
    if (platformEnv.isDesktopLinux) {
      return ETranslations.update_update_incomplete_desc_linux;
    }
    if (platformEnv.isDesktopWin) {
      return ETranslations.update_update_incomplete_desc_windows;
    }
    return ETranslations.update_update_incomplete_desc;
  }, []);

  const image = useMemo(() => {
    if (platformEnv.isDesktopLinux) {
      return null;
    }

    if (platformEnv.isDesktopMac) {
      return (
        <Image
          h="$96"
          source={require('@unionkey/kit/assets/manual_install_mac.png')}
        />
      );
    }
    return (
      <Image
        h="$100"
        mt="$5"
        source={require('@unionkey/kit/assets/manual_install_win.png')}
      />
    );
  }, []);
  return (
    <Page scrollEnabled>
      <Page.Header
        title={intl.formatMessage({
          id: ETranslations.update_update_incomplete_title,
        })}
      />
      <Page.Body>
        <YStack px="$5" gap="$3">
          <SizableText size="$bodyMd">
            {intl.formatMessage({
              id: descTranslationId,
            })}
          </SizableText>
          {image}
          {platformEnv.isDesktopMac ? (
            <SizableText size="$bodyMd" color="$textSubdued">
              {intl.formatMessage({
                id: ETranslations.update_update_incomplete_footnote,
              })}
            </SizableText>
          ) : null}
        </YStack>
      </Page.Body>
      <Page.Footer
        onConfirmText={intl.formatMessage({
          id: ETranslations.update_manual_update,
        })}
        onConfirm={manualInstallPackage}
      />
    </Page>
  );
}
