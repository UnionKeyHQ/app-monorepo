import type { INumberSizeableTextProps } from '@unionkey/components';
import { NumberSizeableText } from '@unionkey/components';
import { useSettingsValuePersistAtom } from '@unionkey/kit-bg/src/states/jotai/atoms';

function NumberSizeableTextWrapper(props: INumberSizeableTextProps) {
  const { hideValue, ...restProps } = props;

  const [settingsValue] = useSettingsValuePersistAtom();

  const shouldHideValue = settingsValue.hideValue && hideValue;

  return <NumberSizeableText {...restProps} hideValue={shouldHideValue} />;
}

export default NumberSizeableTextWrapper;
