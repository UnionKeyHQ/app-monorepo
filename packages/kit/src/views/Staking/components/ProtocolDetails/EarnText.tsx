import type { ISizableTextProps } from '@unionkey/components';
import { FormatHyperlinkText } from '@unionkey/kit/src/components/HyperlinkText';
import type { IEarnText } from '@unionkey/shared/types/staking';

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
