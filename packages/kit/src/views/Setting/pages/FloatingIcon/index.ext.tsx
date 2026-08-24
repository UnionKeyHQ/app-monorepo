import { useIntl } from 'react-intl';

import {
  ESwitchSize,
  Image,
  Page,
  SizableText,
  Switch,
  XStack,
  YStack,
} from '@unionkeyhq/components';
import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import { useSettingsPersistAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms/settings';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { defaultLogger } from '@unionkeyhq/shared/src/logger/logger';

function FloatingIconModal() {
  const intl = useIntl();
  const [settings] = useSettingsPersistAtom();
  return (
    <Page>
      <Page.Header
        title={intl.formatMessage({ id: ETranslations.setting_floating_icon })}
      />
      <Page.Body>
        <YStack p="$5">
          <Image
            borderRadius="$3"
            $md={{
              h: '$40',
            }}
            $gtMd={{
              w: 600,
              h: 272,
            }}
            source={require('@unionkeyhq/kit/assets/floating_icon_placeholder.png')}
          />
          <XStack ai="center" jc="space-between" pt="$4">
            <SizableText size="$bodyLgMedium">
              {intl.formatMessage({
                id: ETranslations.setting_floating_icon_always_display,
              })}
            </SizableText>
            <Switch
              size={ESwitchSize.large}
              value={settings.isFloatingIconAlwaysDisplay}
              onChange={async (value) => {
                await backgroundApiProxy.serviceSetting.setIsShowFloatingButton(
                  value,
                );
                defaultLogger.discovery.dapp.enableFloatingIcon({
                  enable: value,
                });
              }}
            />
          </XStack>
          <SizableText size="$bodySm" color="$textSubdued" mt="$3">
            {intl.formatMessage({
              id: ETranslations.setting_floating_icon_always_display_description,
            })}
          </SizableText>
        </YStack>
      </Page.Body>
    </Page>
  );
}

export default FloatingIconModal;
