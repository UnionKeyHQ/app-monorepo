import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { ListItem } from '@unionkey/kit/src/components/ListItem';
import {
  APP_STORE_LINK,
  EXT_RATE_URL,
  PLAY_STORE_LINK,
} from '@unionkey/shared/src/config/appConfig';
import { ETranslations } from '@unionkey/shared/src/locale';
import platformEnv from '@unionkey/shared/src/platformEnv';
import { openUrlExternal } from '@unionkey/shared/src/utils/openUrlUtils';

const show =
  platformEnv.isExtension ||
  platformEnv.isNativeAndroidGooglePlay ||
  platformEnv.isNativeIOS;

export const RateAppItem = () => {
  const intl = useIntl();
  const onPress = useCallback(() => {
    if (platformEnv.isExtension) {
      let url = EXT_RATE_URL.chrome;
      if (platformEnv.isExtFirefox) url = EXT_RATE_URL.firefox;
      window.open(
        url,
        intl.formatMessage({ id: ETranslations.settings_rate_app }),
      );
    } else if (platformEnv.isNativeAndroidGooglePlay) {
      openUrlExternal(PLAY_STORE_LINK);
    } else if (platformEnv.isNativeIOS) {
      openUrlExternal(APP_STORE_LINK);
    }
  }, [intl]);
  return show ? (
    <ListItem
      onPress={onPress}
      icon="StarOutline"
      title={intl.formatMessage({ id: ETranslations.settings_rate_app })}
      drillIn
    />
  ) : null;
};
