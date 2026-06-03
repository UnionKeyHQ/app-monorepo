import type { ISizableTextProps, IYStackProps } from '@unionkey/components';
import { SizableText, YStack } from '@unionkey/components';

function SignatureConfirmItemLabel(props: ISizableTextProps) {
  return <SizableText size="$bodyMd" color="$textSubdued" {...props} />;
}

function SignatureConfirmItemValue(props: ISizableTextProps) {
  return <SizableText size="$bodyMd" {...props} />;
}

type ISignatureConfirmItemType = IYStackProps & {
  compact?: boolean;
};

function SignatureConfirmItem(props: ISignatureConfirmItemType) {
  const { compact, ...rest } = props;
  return (
    <YStack
      gap="$1"
      {...(compact && {
        flexBasis: '50%',
      })}
      {...rest}
    />
  );
}

SignatureConfirmItem.Label = SignatureConfirmItemLabel;
SignatureConfirmItem.Value = SignatureConfirmItemValue;

export { SignatureConfirmItem };
