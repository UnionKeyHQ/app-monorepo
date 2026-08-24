import { memo } from 'react';

import { ESwitchSize, Switch } from '@unionkeyhq/components';

interface IWebAuthSwitchProps {
  isSupport: boolean;
  isWebAuthEnable: boolean;
  onChange: (checked: boolean) => void;
}

const WebAuthSwitch = ({
  isSupport,
  isWebAuthEnable,
  onChange,
}: IWebAuthSwitchProps) =>
  isSupport ? (
    <Switch
      size={ESwitchSize.small}
      value={isWebAuthEnable}
      onChange={onChange}
    />
  ) : null;

export default memo(WebAuthSwitch);
