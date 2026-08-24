import type { INumberSizeableTextProps } from '@unionkeyhq/components';
import { NumberSizeableText } from '@unionkeyhq/components';
import { useSettingsValuePersistAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';

function NumberSizeableTextWrapper(props: INumberSizeableTextProps) {
  const { hideValue, ...restProps } = props;

  const [settingsValue] = useSettingsValuePersistAtom();

  const shouldHideValue = settingsValue.hideValue && hideValue;

  return <NumberSizeableText {...restProps} hideValue={shouldHideValue} />;
}

export default NumberSizeableTextWrapper;
