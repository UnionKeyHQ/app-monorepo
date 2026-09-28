import type { FC } from 'react';

import { useNavigation, useRoute } from '@react-navigation/core';
import { useIntl } from 'react-intl';

import type {
  UnionKeyLiteChangePinRoutesParams,
  UnionKeyLiteResetRoutesParams,
} from '@unionkeyhq/kit/src/routes';
import { UnionKeyLiteChangePinModalRoutes } from '@unionkeyhq/kit/src/routes/routesEnum';
import type { ModalScreenProps } from '@unionkeyhq/kit/src/routes/types';

import HardwarePinCode from '../../BasePinCode';

import type { RouteProp } from '@react-navigation/core';

type NavigationProps = ModalScreenProps<UnionKeyLiteResetRoutesParams> &
  ModalScreenProps<UnionKeyLiteChangePinRoutesParams>;

const UnionKeyLiteNewSetPinCode: FC = () => {
  const intl = useIntl();
  const route =
    useRoute<
      RouteProp<
        UnionKeyLiteChangePinRoutesParams,
        UnionKeyLiteChangePinModalRoutes.UnionKeyLiteChangePinSetModal
      >
    >();

  const { currentPin } = route.params;

  const navigation = useNavigation<NavigationProps['navigation']>();

  return (
    <HardwarePinCode
      title={intl.formatMessage({ id: 'title__set_up_new_pin' })}
      description={intl.formatMessage({ id: 'title__set_up_new_pin_desc' })}
      securityReminder={intl.formatMessage({
        id: 'content__we_dont_store_any_of_your_information',
      })}
      onComplete={(pinCode) => {
        navigation.navigate(
          UnionKeyLiteChangePinModalRoutes.UnionKeyLiteChangePinRepeatModal,
          { currentPin, newPin: pinCode },
        );
        return Promise.resolve('');
      }}
    />
  );
};

export default UnionKeyLiteNewSetPinCode;
