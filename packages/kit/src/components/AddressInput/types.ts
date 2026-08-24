import type { EInputAddressChangeType } from '@unionkeyhq/shared/types/address';

export type IAddressPluginProps = {
  onChange?: (text: string) => void;
  onInputTypeChange?: (type: EInputAddressChangeType) => void;
  testID?: string;
  disabled?: boolean;
};
