import { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { Image, Page, SizableText, Stack, YStack } from '@unionkey/components';
import type { EMnemonicType } from '@unionkey/core/src/secret';
import useAppNavigation from '@unionkey/kit/src/hooks/useAppNavigation';
import { useUserWalletProfile } from '@unionkey/kit/src/hooks/useUserWalletProfile';
import { BIP39_DOT_MAP_URL } from '@unionkey/shared/src/config/appConfig';
import { ETranslations } from '@unionkey/shared/src/locale';
import { defaultLogger } from '@unionkey/shared/src/logger/logger';
import { EOnboardingPages } from '@unionkey/shared/src/routes';
import { openUrlExternal } from '@unionkey/shared/src/utils/openUrlUtils';

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
            source={require('@unionkey/kit/assets/keytag/bip39-dotmap.png')}
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
