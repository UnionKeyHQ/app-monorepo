import type { IStackProps } from '@unionkeyhq/components';
import { Badge } from '@unionkeyhq/components';

const SwapPercentageStageBadge = ({
  stage,
  onSelectStage,
  badgeSize,
  ...props
}: {
  stage: number;
  badgeSize?: 'sm' | 'lg';
  onSelectStage?: (stage: number) => void;
} & IStackProps) => (
  <Badge
    role="button"
    badgeSize={badgeSize ?? 'sm'}
    onPress={() => {
      onSelectStage?.(stage);
    }}
    px="$1.5"
    bg="$bgSubdued"
    borderRadius="$2"
    userSelect="none"
    hoverStyle={{
      bg: '$bgStrongHover',
    }}
    pressStyle={{
      bg: '$bgStrongActive',
    }}
    {...props}
  >
    <Badge.Text size="$bodySmMedium" color="$textSubdued">
      {stage}%
    </Badge.Text>
  </Badge>
);

export default SwapPercentageStageBadge;
