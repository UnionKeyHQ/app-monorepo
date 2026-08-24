import { useIntl } from 'react-intl';

import { Switch, XStack } from '@unionkeyhq/components';
import { ETranslations } from '@unionkeyhq/shared/src/locale';

import { InfoItemLabel } from './InfoItemLabel';

export interface IAntiMEVToggleProps {
  value: boolean;
  onToggle: () => void;
}

export function AntiMEVToggle({ value, onToggle }: IAntiMEVToggleProps) {
  const intl = useIntl();
  return (
    <XStack justifyContent="space-between" alignItems="center">
      <InfoItemLabel
        title={intl.formatMessage({ id: ETranslations.mev_protection_label })}
      />

      <Switch size="small" value={value} onChange={onToggle} />
    </XStack>
  );
}
