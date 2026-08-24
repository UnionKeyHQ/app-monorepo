import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import {
  Divider,
  Icon,
  Page,
  SizableText,
  Stack,
  XStack,
  YStack,
} from '@unionkeyhq/components';
import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import { ListItem } from '@unionkeyhq/kit/src/components/ListItem';
import { WalletListView } from '@unionkeyhq/kit/src/components/WalletListView';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { usePromiseResult } from '@unionkeyhq/kit/src/hooks/usePromiseResult';
import type { IDBWallet } from '@unionkeyhq/kit-bg/src/dbs/local/types';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { EModalKeyTagRoutes } from '@unionkeyhq/shared/src/routes';
import accountUtils from '@unionkeyhq/shared/src/utils/accountUtils';
import { EReasonForNeedPassword } from '@unionkeyhq/shared/types/setting';

const ListFooterComponent = ({ walletCount }: { walletCount: number }) => {
  const intl = useIntl();
  const navigation = useAppNavigation();
  const onPress = useCallback(() => {
    navigation.push(EModalKeyTagRoutes.BackupRecoveryPhrase);
  }, [navigation]);
  return (
    <YStack>
      {walletCount ? (
        <YStack>
          <SizableText size="$bodySm" color="$textSubdued" px="$5" mt="$5">
            {intl.formatMessage({
              id: ETranslations.settings_hardware_wallets_not_appear,
            })}
          </SizableText>
          <XStack px="$5" pt="$5" pb="$4">
            <Divider />
          </XStack>
        </YStack>
      ) : null}
      <ListItem
        icon="PencilOutline"
        title={intl.formatMessage({
          id: ETranslations.global_enter_recovery_phrase,
        })}
        drillIn
        onPress={onPress}
        renderIcon={
          <Stack bg="$bgStrong" p="$2" borderRadius="$3">
            <Icon name="PencilOutline" size="$6" color="$icon" />
          </Stack>
        }
      />
    </YStack>
  );
};

const BackupWallet = () => {
  const intl = useIntl();
  const navigation = useAppNavigation();
  const walletList = usePromiseResult(async () => {
    const { wallets } = await backgroundApiProxy.serviceAccount.getWallets();
    const hdWalletList = wallets.filter((wallet) =>
      accountUtils.isHdWallet({ walletId: wallet.id }),
    );
    return hdWalletList;
  }, []).result;
  const onPick = useCallback(
    async (item: IDBWallet) => {
      const { mnemonic: encodedText } =
        await backgroundApiProxy.serviceAccount.getHDAccountMnemonic({
          walletId: item.id,
          reason: EReasonForNeedPassword.Security,
        });
      navigation.push(EModalKeyTagRoutes.BackupDotMap, {
        wallet: item,
        encodedText,
        title: item.name,
      });
    },
    [navigation],
  );
  return (
    <Page>
      <Page.Header
        title={intl.formatMessage({ id: ETranslations.settings_select_wallet })}
      />
      <Page.Body>
        <WalletListView
          walletList={walletList}
          ListFooterComponent={
            <ListFooterComponent walletCount={walletList?.length ?? 0} />
          }
          onPick={onPick}
        />
      </Page.Body>
    </Page>
  );
};

export default BackupWallet;
