import { useIntl } from 'react-intl';

import { type IIconProps, type IKeyOfIcons } from '@unionkeyhq/components';
import { useFirmwareVerifyDialog } from '@unionkeyhq/kit/src/views/Onboarding/pages/ConnectHardwareWallet/FirmwareVerifyDialog';
import type { IDBDevice } from '@unionkeyhq/kit-bg/src/dbs/local/types';
import { ETranslations } from '@unionkeyhq/shared/src/locale';

import { WalletOptionItem } from './WalletOptionItem';

export function Verification({ device }: { device?: IDBDevice | undefined }) {
  const intl = useIntl();

  const getIconNameAndIconColor = (): {
    iconName: IKeyOfIcons;
    iconColor: IIconProps['color'];
  } => {
    if (device?.verifiedAtVersion) {
      return {
        iconName: 'BadgeVerifiedSolid',
        iconColor: '$iconSuccess',
      };
    }

    if (device?.verifiedAtVersion === '') {
      // unUnofficial device cannot create a wallet
      return {
        iconName: 'ErrorSolid',
        iconColor: '$iconCritical',
      };
    }

    return {
      iconName: 'DocumentSearch2Outline',
      iconColor: '$iconSubdued',
    };
  };

  const { iconColor, iconName } = getIconNameAndIconColor();

  const { showFirmwareVerifyDialog } = useFirmwareVerifyDialog();

  return (
    <WalletOptionItem
      icon={iconName}
      iconColor={iconColor}
      // icon="BadgeVerifiedSolid"
      // iconColor="$iconSuccess"
      label={intl.formatMessage({
        id: ETranslations.device_auth_request_title,
      })}
      onPress={async () => {
        if (!device) {
          return;
        }
        await showFirmwareVerifyDialog({
          device,
          features: device.featuresInfo,
          onContinue: async ({ checked }) => {
            console.log(checked);
          },
          onClose: async () => {},
        });
        // setTimeout(async () => {
        //   // TODO: dialog.close().then(() => doDomeThing())
        //   await dialog.close();

        //   // if official
        //   returnVerified();

        //   // if unofficial
        //   // returnUnofficial();
        // }, 1500);
      }}
    />
  );
}
