import { Stack } from '@unionkeyhq/components';
import { ListItem } from '@unionkeyhq/kit/src/components/ListItem';
import { WalletAvatar } from '@unionkeyhq/kit/src/components/WalletAvatar';
import { showWalletAvatarEditDialog } from '@unionkeyhq/kit/src/views/AccountManagerStacks/components/WalletAvatarEdit';
import { WalletRenameButton } from '@unionkeyhq/kit/src/views/AccountManagerStacks/components/WalletRename';
import type { IDBWallet } from '@unionkeyhq/kit-bg/src/dbs/local/types';
import accountUtils from '@unionkeyhq/shared/src/utils/accountUtils';

export function WalletProfile({ wallet }: { wallet: IDBWallet }) {
  return (
    <ListItem
      gap="$1.5"
      renderAvatar={
        <Stack
          role="button"
          borderRadius="$2"
          {...(accountUtils.isHdWallet({ walletId: wallet.id }) && {
            onPress: () => showWalletAvatarEditDialog({ wallet }),
            hoverStyle: {
              bg: '$bgHover',
            },
            pressStyle: {
              bg: '$bgActive',
            },
            focusable: true,
            focusVisibleStyle: {
              outlineOffset: 2,
              outlineWidth: 2,
              outlineColor: '$focusRing',
              outlineStyle: 'solid',
            },
          })}
        >
          <Stack>
            <WalletAvatar size="$10" wallet={wallet} />
            {accountUtils.isHdWallet({ walletId: wallet.id }) ? (
              <ListItem.Avatar.CornerIcon
                name="MenuCircleHorSolid"
                color="$iconSubdued"
              />
            ) : null}
          </Stack>
        </Stack>
      }
      // renderIcon={null}
    >
      <WalletRenameButton wallet={wallet} />
    </ListItem>
  );
}
