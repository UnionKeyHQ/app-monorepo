import { useCallback, useState } from 'react';

import { useIntl } from 'react-intl';

import { Button } from '@unionkeyhq/components';
import type { IButtonProps } from '@unionkeyhq/components';
import { ETranslations } from '@unionkeyhq/shared/src/locale';

export interface IApproveButtonProps extends IButtonProps {
  onApprove: () => void;
}

export function ApproveButton({ onApprove, ...props }: IApproveButtonProps) {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const handleApprove = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      onApprove();
      setLoading(false);
    }, 1000);
  }, [onApprove]);

  return (
    <Button
      variant="primary"
      size="large"
      loading={loading}
      {...props}
      onPress={handleApprove}
    >
      {intl.formatMessage({ id: ETranslations.global_approve })}
    </Button>
  );
}
