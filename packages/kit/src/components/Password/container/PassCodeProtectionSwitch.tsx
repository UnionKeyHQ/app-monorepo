import type { ISwitchProps } from '@unionkey/components';
import { Switch } from '@unionkey/components';
import { usePasswordPersistAtom } from '@unionkey/kit-bg/src/states/jotai/atoms';

/**
 * PassCodeProtectionSwitch component
 * @param {ISwitchProps} switchProps - Props to be passed to the underlying Switch component
 */
const PassCodeProtectionSwitch = (switchProps: ISwitchProps) => {
  const [{ enablePasswordErrorProtection }, setPasswordPersist] =
    usePasswordPersistAtom();

  return (
    <Switch
      value={enablePasswordErrorProtection}
      onChange={(value: boolean) => {
        setPasswordPersist((v) => ({
          ...v,
          enablePasswordErrorProtection: value,
        }));
      }}
      {...switchProps}
    />
  );
};

export default PassCodeProtectionSwitch;
