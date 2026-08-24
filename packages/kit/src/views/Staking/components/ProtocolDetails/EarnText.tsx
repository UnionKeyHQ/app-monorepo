import type { ISizableTextProps } from '@unionkeyhq/components';
import { FormatHyperlinkText } from '@unionkeyhq/kit/src/components/HyperlinkText';
import type { IEarnText } from '@unionkeyhq/shared/types/staking';

export function EarnText({
  text,
  color,
  size,
  ...props
}: { text?: IEarnText } & ISizableTextProps) {
  return text ? (
    <FormatHyperlinkText
      color={text.color || color}
      size={text.size || size}
      {...props}
    >
      {text.text}
    </FormatHyperlinkText>
  ) : null;
}
