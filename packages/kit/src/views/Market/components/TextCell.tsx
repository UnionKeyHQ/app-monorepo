import type { INumberSizeableTextProps } from '@unionkey/components';
import {
  NumberSizeableText,
  SizableText,
  XStack,
  YStack,
} from '@unionkey/components';
import { useSettingsPersistAtom } from '@unionkey/kit-bg/src/states/jotai/atoms';

export function TextCell({
  title,
  children,
  rank,
}: {
  title: string;
  rank?: number;
  children: INumberSizeableTextProps['children'];
}) {
  const [settings] = useSettingsPersistAtom();
  const currency = settings.currencyInfo.symbol;
  return (
    <YStack pt="$3">
      <SizableText size="$bodySm" color="$textSubdued">
        {title}
      </SizableText>
      <XStack gap="$1" ai="center">
        <NumberSizeableText
          numberOfLines={1}
          size="$bodyMdMedium"
          formatter="marketCap"
          formatterOptions={{ currency }}
        >
          {children}
        </NumberSizeableText>
        {rank ? (
          <YStack px="$1" borderRadius="$1" bg="$bgStrong">
            <SizableText size="$bodySm" color="$textSubdued">
              {`#${rank}`}
            </SizableText>
          </YStack>
        ) : null}
      </XStack>
    </YStack>
  );
}
