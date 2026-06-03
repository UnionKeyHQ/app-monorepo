import { YStack, useMedia } from '@unionkey/components';
import { HyperlinkText } from '@unionkey/kit/src/components/HyperlinkText';
import { ETranslations } from '@unionkey/shared/src/locale';
import type { IFetchLimitOrderRes } from '@unionkey/shared/types/swap/types';

import LimitOrderCard from '../../components/LimitOrderCard';

const LimitOrderCancelDialog = ({ item }: { item: IFetchLimitOrderRes }) => {
  const { gtMd } = useMedia();
  return (
    <YStack gap="$4">
      <LimitOrderCard
        item={item}
        hiddenCancelIcon
        hiddenHoverBg
        progressWidth={gtMd ? 120 : 100}
      />
      <HyperlinkText
        size="$bodyMd"
        color="$textSubdued"
        translationId={ETranslations.limit_cancel_order_off_chain_tip}
      />
    </YStack>
  );
};

export default LimitOrderCancelDialog;
