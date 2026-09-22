import type { FC } from 'react';

import { useIntl } from 'react-intl';

import { Container } from '@unionkeyhq/components';
import type { ContentItemProps } from '@unionkeyhq/components/src/Container/ContentBasisItem';
import type { EVMDecodedItem } from '@unionkeyhq/engine/src/vaults/impl/evm/decoder/types';

export type HashProps = {
  tx: EVMDecodedItem;
} & ContentItemProps;

const ContractData: FC<HashProps> = (props) => {
  const { tx } = props;
  const intl = useIntl();

  return (
    <Container.Item
      {...props}
      title={intl.formatMessage({ id: 'form__contract_data' })}
      describe={tx.data.slice(0, 200)}
    />
  );
};

export default ContractData;
