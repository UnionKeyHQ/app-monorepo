import { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { Image, Page, SizableText, Stack, YStack } from '@unionkeyhq/components';
import type { EMnemonicType } from '@unionkeyhq/core/src/secret';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { useUserWalletProfile } from '@unionkeyhq/kit/src/hooks/useUserWalletProfile';
import { BIP39_DOT_MAP_URL } from '@unionkeyhq/shared/src/config/appConfig';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { defaultLogger } from '@unionkeyhq/shared/src/logger/logger';
import { EOnboardingPages } from '@unionkeyhq/shared/src/routes';
import { openUrlExternal } from '@unionkeyhq/shared/src/utils/openUrlUtils';

import { PhaseInputArea } from '../../components/PhaseInputArea';

const KeyTagFooterComponent = () => {
  const intl = useIntl();
  const onPress = useCallback(() => {
    openUrlExternal(BIP39_DOT_MAP_URL);
  }, []);
  return (
    <YStack px="$5" mt="$10">
      <SizableText size="$headingSm" color="$textSubdued">
        {intl.formatMessage({
          id: ETranslations.settings_how_to_import_from_unionkey_keytag,
        })}
      </SizableText>
      <SizableText size="$bodyMd" color="$textSubdued">
        {intl.formatMessage(
          {
            id: ETranslations.settings_how_to_import_from_unionkey_keytag_desc,
          },
          {
            dotmap: (
              <SizableText
                textDecorationLine="underline"
                size="$bodyMd"
                onPress={onPress}
                color="$textSubdued"
                px="$1"
              >
                BIP39-DotMap
              </SizableText>
            ),
          },
        )}
      </SizableText>
      <Stack borderRadius={12} mt="$5" overflow="hidden">
        <Stack width="100%" $sm={{ height: 224 }} height={300}>
          <Image
            width="100%"
            height="100%"
            source={require('@unionkeyhq/kit/assets/keytag/bip39-dotmap.png')}
          />
        </Stack>
      </Stack>
    </YStack>
  );
};

export function ImportKeyTag() {
  const intl = useIntl();
  const navigation = useAppNavigation();

  const { isSoftwareWalletOnlyUser } = useUserWalletProfile();
  const handleConfirmPress = useCallback(
    async (params: { mnemonic: string; mnemonicType: EMnemonicType }) => {
      navigation.push(EOnboardingPages.FinalizeWalletSetup, {
        mnemonic: params.mnemonic,
        isWalletBackedUp: true,
      });
      defaultLogger.account.wallet.walletAdded({
        status: 'success',
        addMethod: 'ImportWallet',
        details: {
          importType: 'keyTag',
        },
        isSoftwareWalletOnlyUser,
      });
      defaultLogger.setting.page.keyTagImportResult({ isSuccess: true });
    },
    [navigation, isSoftwareWalletOnlyUser],
  );

  const renderPhaseInputArea = useMemo(
    () => (
      <PhaseInputArea
        defaultPhrases={[]}
        onConfirm={handleConfirmPress}
        FooterComponent={<KeyTagFooterComponent />}
      />
    ),
    [handleConfirmPress],
  );
  return (
    <Page scrollEnabled>
      <Page.Header
        title={intl.formatMessage({
          id: ETranslations.global_import_recovery_phrase,
        })}
      />
      {renderPhaseInputArea}
    </Page>
  );
}

export default ImportKeyTag;
