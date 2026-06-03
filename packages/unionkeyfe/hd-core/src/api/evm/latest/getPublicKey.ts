import { EthereumGetPublicKeyOneKey, MessageResponse, TypedCall } from '@unionkeyfe/hd-transport';

export default async function ({
  typedCall,
  param,
}: {
  typedCall: TypedCall;
  param: EthereumGetPublicKeyOneKey;
}): Promise<MessageResponse<'EthereumPublicKeyOneKey'>> {
  return typedCall('EthereumGetPublicKeyOneKey', 'EthereumPublicKeyOneKey', {
    ...param,
  });
}
