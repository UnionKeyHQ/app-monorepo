import { useIntl } from 'react-intl';

import { IconButton, SizableText, Stack } from '@unionkey/components';
import { useToOnBoardingPage } from '@unionkey/kit/src/views/Onboarding/hooks/useToOnBoardingPage';
import { ETranslations } from '@unionkey/shared/src/locale';

import { useAccountSelectorRoute } from '../../../router/useAccountSelectorRoute';

export function AccountSelectorCreateWalletButton() {
  const intl = useIntl();

  const route = useAccountSelectorRoute();
  const toOnBoardingPage = useToOnBoardingPage();
  // const linkNetwork = route.params?.linkNetwork;
  const isEditableRouteParams = route.params?.editable;

  if (!isEditableRouteParams) {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onboardingButton = (
    <IconButton
      onPress={() => {
        void toOnBoardingPage();
      }}
      icon="PlusSmallOutline"
      testID="account-add-wallet"
    />
  );
  return (
    <Stack p="$1" alignItems="center">
      <IconButton
        onPress={() => {
          void toOnBoardingPage();
        }}
        icon="PlusLargeOutline"
        p="$2"
        testID="add-wallet"
        variant="primary"
      />
      <SizableText textAlign="center" size="$bodySm" mt="$1">
        {intl.formatMessage({ id: ETranslations.global_add_wallet })}
      </SizableText>
    </Stack>
  );
}
