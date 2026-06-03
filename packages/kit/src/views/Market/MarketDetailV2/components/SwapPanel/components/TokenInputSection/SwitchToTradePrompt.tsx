import { useIntl } from 'react-intl';

import { SizableText, YStack } from '@unionkey/components';
import { useMarketTradeActions } from '@unionkey/kit/src/views/Market/components/tradeHook';
import { ETranslations } from '@unionkey/shared/src/locale';

interface ISwitchToTradePromptProps {
  onTradePress: () => void;
}

export function SwitchToTradePrompt(props: ISwitchToTradePromptProps) {
  const { onTradePress } = props;
  const intl = useIntl();
  const { onSwap } = useMarketTradeActions(null);

  const handleTradePress = () => {
    void onSwap();
    onTradePress?.();
  };

  return (
    <YStack
      onPress={handleTradePress}
      borderBottomLeftRadius="$3"
      borderBottomRightRadius="$3"
      backgroundColor="$bgSubdued"
      px="$5"
      py="$2"
      alignItems="center"
    >
      <SizableText size="$bodyMd" color="$textSubdued">
        If you wish to trade other tokens, switch to{' '}
        <SizableText fontWeight="bold" cursor="pointer">
          {intl.formatMessage({ id: ETranslations.global_trade })}
        </SizableText>
      </SizableText>
    </YStack>
  );
}
