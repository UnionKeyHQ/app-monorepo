import type { ComponentProps } from 'react';

import { ListView } from '@unionkeyhq/components';
import { ListItem } from '@unionkeyhq/kit/src/components/ListItem';
import { WalletAvatar } from '@unionkeyhq/kit/src/components/WalletAvatar';
import type { IDBWallet } from '@unionkeyhq/kit-bg/src/dbs/local/types';

type IWalletListViewProps = {
  walletList: IDBWallet[] | undefined;
  onPick?: (item: IDBWallet) => void;
  ListEmptyComponent?: ComponentProps<typeof ListView>['ListEmptyComponent'];
  ListFooterComponent?: ComponentProps<typeof ListView>['ListFooterComponent'];
};

export function WalletListView({
  walletList,
  onPick,
  ListEmptyComponent,
  ListFooterComponent,
}: IWalletListViewProps) {
  return (
    <ListView
      data={walletList}
      renderItem={({ item }) => (
        <ListItem
          renderAvatar={<WalletAvatar wallet={item} />}
          title={item.name}
          drillIn
          onPress={() => onPick?.(item)}
        />
      )}
      estimatedItemSize="$10"
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
    />
  );
}
