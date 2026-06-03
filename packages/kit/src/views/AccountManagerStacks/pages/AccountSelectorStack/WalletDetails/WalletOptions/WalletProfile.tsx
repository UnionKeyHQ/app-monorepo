import { Stack } from '@unionkey/components';
import { ListItem } from '@unionkey/kit/src/components/ListItem';
import { WalletAvatar } from '@unionkey/kit/src/components/WalletAvatar';
import { showWalletAvatarEditDialog } from '@unionkey/kit/src/views/AccountManagerStacks/components/WalletAvatarEdit';
import { WalletRenameButton } from '@unionkey/kit/src/views/AccountManagerStacks/components/WalletRename';
import type { IDBWallet } from '@unionkey/kit-bg/src/dbs/local/types';
import accountUtils from '@unionkey/shared/src/utils/accountUtils';

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
