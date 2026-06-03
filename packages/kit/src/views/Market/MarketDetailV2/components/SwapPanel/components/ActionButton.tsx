import { useIntl } from 'react-intl';

import { Button } from '@unionkey/components';
import type { IButtonProps } from '@unionkey/components';
import { ETranslations } from '@unionkey/shared/src/locale';

import type { ITradeType } from '../hooks/useTradeType';

export interface IActionButtonProps extends IButtonProps {
  tradeType: ITradeType;
  amount: string;
  token?: {
    symbol: string;
  };
  totalValue: number;
}

export function ActionButton({
  tradeType,
  amount,
  token,
  totalValue,
  ...props
}: IActionButtonProps) {
  const intl = useIntl();
  const actionText =
    tradeType === 'buy'
      ? intl.formatMessage({ id: ETranslations.global_buy })
      : intl.formatMessage({ id: ETranslations.global_sell });
  const numericAmount = parseFloat(amount);
  const displayAmount = Number.isNaN(numericAmount) ? '' : amount;

  return (
    <Button variant="primary" size="large" {...props}>
      {actionText} {displayAmount} {token?.symbol || ''} ($
      {totalValue.toFixed(2)})
    </Button>
  );
}
