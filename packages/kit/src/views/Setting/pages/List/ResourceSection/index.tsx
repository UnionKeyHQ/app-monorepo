import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { Badge } from '@unionkeyhq/components';
import { ListItem } from '@unionkeyhq/kit/src/components/ListItem';
import { Section } from '@unionkeyhq/kit/src/components/Section';
import { useAppUpdateInfo } from '@unionkeyhq/kit/src/components/UpdateReminder/hooks';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { useHelpLink } from '@unionkeyhq/kit/src/hooks/useHelpLink';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import { EModalRoutes } from '@unionkeyhq/shared/src/routes';
import { EModalShortcutsRoutes } from '@unionkeyhq/shared/src/routes/shortcuts';

import { UrlExternalListItem } from '../../../components/UrlExternalListItem';

import { CustomNetworkConfigItem } from './CustomNetworkConfigItem';
import { RateAppItem } from './RateAppItem';
import { StateLogsItem } from './StateLogsItem';

function ListVersionItem() {
  const intl = useIntl();
  const appUpdateInfo = useAppUpdateInfo();
  const handleToUpdatePreviewPage = useCallback(() => {
    appUpdateInfo.toUpdatePreviewPage();
  }, [appUpdateInfo]);
  return appUpdateInfo.isNeedUpdate ? (
    <ListItem
      onPress={handleToUpdatePreviewPage}
      icon="InfoCircleOutline"
      iconProps={{ color: '$textInfo' }}
      title={intl.formatMessage({
        id: ETranslations.settings_app_update_available,
      })}
      titleProps={{ color: '$textInfo' }}
      drillIn
    >
      <ListItem.Text
        primary={
          <Badge badgeType="info" badgeSize="lg">
            {appUpdateInfo.data.latestVersion}
          </Badge>
        }
        align="right"
      />
    </ListItem>
  ) : (
    <ListItem
      onPress={appUpdateInfo.onViewReleaseInfo}
      icon="InfoCircleOutline"
      title={intl.formatMessage({ id: ETranslations.settings_whats_new })}
      drillIn
    >
      <ListItem.Text primary={platformEnv.version} align="right" />
    </ListItem>
  );
}

function ListShortcutsItem() {
  const intl = useIntl();
  const navigation = useAppNavigation();
  const toShortcutsPage = useCallback(() => {
    navigation.pushModal(EModalRoutes.ShortcutsModal, {
      screen: EModalShortcutsRoutes.ShortcutsPreview,
    });
  }, [navigation]);
  return platformEnv.isDesktop ? (
    <ListItem
      onPress={toShortcutsPage}
      icon="ShortcutsCustom"
      title={intl.formatMessage({ id: ETranslations.settings_shortcuts })}
      drillIn
    />
  ) : null;
}

export const ResourceSection = () => {
  const userAgreementUrl = useHelpLink({ path: 'unionkey-usage-guide/deposit-terms.html' });
  const privacyPolicyUrl = useHelpLink({ path: 'unionkey-usage-guide/Privacy-Policy.html' });
 
  const requestUrl = useHelpLink({ path: 'topic/unionkey-use-kp.html' });
  const helpCenterUrl = useHelpLink({ path: 'topic/unionkey-use-kp.html' });
  const intl = useIntl();

  return (
    <Section
      title={intl.formatMessage({ id: ETranslations.settings_resources })}
    >
      <ListVersionItem />
      <ListShortcutsItem />
      <UrlExternalListItem
        icon="HelpSupportOutline"
        title={intl.formatMessage({ id: ETranslations.settings_help_center })}
        url={helpCenterUrl}
        drillIn
      />
      <UrlExternalListItem
        icon="EditOutline"
        title={intl.formatMessage({
          id: ETranslations.settings_submit_request,
        })}
        url={requestUrl}
        drillIn
      />
      <RateAppItem />
      <UrlExternalListItem
        icon="PeopleOutline"
        title={intl.formatMessage({
          id: ETranslations.settings_user_agreement,
        })}
        url={userAgreementUrl}
        drillIn
      />
      <UrlExternalListItem
        icon="FileTextOutline"
        title={intl.formatMessage({
          id: ETranslations.settings_privacy_policy,
        })}
        url={privacyPolicyUrl}
        drillIn
      />
      <CustomNetworkConfigItem />
      <StateLogsItem />
    </Section>
  );
};
