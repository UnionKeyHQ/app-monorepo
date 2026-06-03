import { useIntl } from 'react-intl';

import {
  ESwitchSize,
  Page,
  SizableText,
  Stack,
  Switch,
  YStack,
} from '@unionkey/components';
import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { ListItem } from '@unionkey/kit/src/components/ListItem';
import { useSettingsPersistAtom } from '@unionkey/kit-bg/src/states/jotai/atoms';
import { ETranslations } from '@unionkey/shared/src/locale';

const SpendUTXO = () => {
  const intl = useIntl();
  const [settings] = useSettingsPersistAtom();
  return (
    <Page>
      <YStack>
        <ListItem
          title={intl.formatMessage({
            id: ETranslations.settings_spend_dust_utxo,
          })}
        >
          <Switch
            size={ESwitchSize.large}
            value={settings.spendDustUTXO}
            onChange={async (value) => {
              await backgroundApiProxy.serviceSetting.setSpendDustUTXO(value);
            }}
          />
        </ListItem>
        <Stack px="$5">
          <SizableText color="$textSubdued" size="$bodySm">
            {intl.formatMessage({
              id: ETranslations.settings_spend_dust_utxo_desc,
            })}
          </SizableText>
        </Stack>
      </YStack>
    </Page>
  );
};

export default SpendUTXO;
