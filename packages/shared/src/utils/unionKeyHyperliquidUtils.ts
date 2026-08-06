/* eslint-disable spellcheck/spell-checker */
import { encode } from 'algo-msgpack-with-bigint';
import BigNumber from 'bignumber.js';
import { keccak256 } from 'ethersV6';

import type {
  IUnionKeyAgentApprovalTypedData,
  IUnionKeyAssistTypedData,
  IUnionKeyHyperliquidApproveAgentAction,
  IUnionKeyHyperliquidTradingAction,
} from '@onekeyhq/shared/types/unionkey/trade';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const HYPERLIQUID_SIGNATURE_CHAIN_ID = 42_161;

const numberToUint64Bytes = (value: number) => {
  let remaining = BigInt(value);
  const bytes = new Uint8Array(8);
  for (let index = bytes.length - 1; index >= 0; index -= 1) {
    bytes[index] = Number(remaining % BigInt(256));
    remaining /= BigInt(256);
  }
  return bytes;
};

const concatBytes = (...items: Uint8Array[]) => {
  const output = new Uint8Array(
    items.reduce((length, item) => length + item.length, 0),
  );
  let offset = 0;
  items.forEach((item) => {
    output.set(item, offset);
    offset += item.length;
  });
  return output;
};

export const buildUnionKeyHyperliquidActionHash = ({
  action,
  nonce,
  expiresAfter,
}: {
  action: IUnionKeyHyperliquidTradingAction;
  nonce: number;
  expiresAfter: number;
}) => {
  const packedAction = encode(action);
  const payload = concatBytes(
    packedAction,
    numberToUint64Bytes(nonce),
    new Uint8Array([0]),
    new Uint8Array([0]),
    numberToUint64Bytes(expiresAfter),
  );
  return keccak256(payload);
};

export const buildUnionKeyHyperliquidTypedData = (
  connectionId: string,
  environment: 'testnet' | 'mainnet' = 'mainnet',
): IUnionKeyAssistTypedData => ({
  domain: {
    chainId: 1337,
    name: 'Exchange',
    verifyingContract: ZERO_ADDRESS,
    version: '1',
  },
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Agent: [
      { name: 'source', type: 'string' },
      { name: 'connectionId', type: 'bytes32' },
    ],
  },
  primaryType: 'Agent',
  message: {
    source: environment === 'mainnet' ? 'a' : 'b',
    connectionId,
  },
});

export const buildUnionKeyHyperliquidAgentApprovalTypedData = (
  action: IUnionKeyHyperliquidApproveAgentAction,
): IUnionKeyAgentApprovalTypedData => ({
  domain: {
    chainId: HYPERLIQUID_SIGNATURE_CHAIN_ID,
    name: 'HyperliquidSignTransaction',
    verifyingContract: ZERO_ADDRESS,
    version: '1',
  },
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    'HyperliquidTransaction:ApproveAgent': [
      { name: 'hyperliquidChain', type: 'string' },
      { name: 'agentAddress', type: 'address' },
      { name: 'agentName', type: 'string' },
      { name: 'nonce', type: 'uint64' },
    ],
  },
  primaryType: 'HyperliquidTransaction:ApproveAgent',
  message: {
    hyperliquidChain: action.hyperliquidChain,
    agentAddress: action.agentAddress,
    agentName: action.agentName,
    nonce: action.nonce,
  },
});

export const formatUnionKeyHyperliquidPrice = ({
  value,
  sizeDecimals,
}: {
  value: BigNumber.Value;
  sizeDecimals: number;
}) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    throw new Error('订单价格无效');
  }
  const significantValue = Number(numericValue.toPrecision(5));
  return new BigNumber(significantValue)
    .decimalPlaces(Math.max(0, 6 - sizeDecimals), BigNumber.ROUND_HALF_UP)
    .toFixed();
};
