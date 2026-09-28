import { UnionKeyNetwork } from '@unionkeyhq/shared/src/config/networkIds';

import {
  MainnetKeleContractAddress,
  MainnetLidoContractAddress,
  MainnetLidoWithdrawalERC721,
  MainnetMaticContractAddress,
  MainnetStMaticContractAddress,
  TestnetKeleContractAddress,
  TestnetLidoContractAddress,
  TestnetLidoWithdrawalERC721,
  TestnetMaticContractAddress,
  TestnetStMaticContractAddress,
} from './config';

export const getMaticContractAdderess = (networkId: string) => {
  if (networkId === UnionKeyNetwork.eth) {
    return MainnetMaticContractAddress;
  }
  if (networkId === UnionKeyNetwork.goerli) {
    return TestnetMaticContractAddress;
  }
  throw new Error('Not supported network');
};

export const getStMaticContractAdderess = (networkId: string) => {
  if (networkId === UnionKeyNetwork.eth) {
    return MainnetStMaticContractAddress;
  }
  if (networkId === UnionKeyNetwork.goerli) {
    return TestnetStMaticContractAddress;
  }
  throw new Error('Not supported network');
};

export const getLidoContractAddress = (networkId: string) => {
  if (networkId === UnionKeyNetwork.eth) {
    return MainnetLidoContractAddress;
  }
  if (networkId === UnionKeyNetwork.goerli) {
    return TestnetLidoContractAddress;
  }
  throw new Error('Not supported network');
};

export const getKeleContractAddress = (networkId: string): string => {
  if (networkId === UnionKeyNetwork.eth) {
    return MainnetKeleContractAddress;
  }
  if (networkId === UnionKeyNetwork.goerli) {
    return TestnetKeleContractAddress;
  }
  throw new Error('Not supported network');
};

export const getLidoNFTContractAddress = (networkId: string) => {
  if (networkId === UnionKeyNetwork.eth) {
    return MainnetLidoWithdrawalERC721;
  }
  if (networkId === UnionKeyNetwork.goerli) {
    return TestnetLidoWithdrawalERC721;
  }
  throw new Error('Not supported network');
};
