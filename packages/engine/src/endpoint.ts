const endpointsMap: Record<
  | 'fiat'
  | 'wss'
  | 'covalent'
  | 'mempool'
  | 'getblock'
  | 'algosigner'
  | 'tronscan'
  | 'solscan',
  { prd: string; test: string }
> = {
  fiat: {
    prd: 'https://api.unionkey.io/api',
    test: 'https://api-sandbox.unionkey.io/api',
    // test: 'http://127.0.0.1:9000/api',
  },
  wss: {
    prd: 'wss://api.unionkey.io',
    test: 'wss://api-sandbox.unionkey.io',
  },
  covalent: {
    prd: 'https://api.unionkey.io/covalent/client1-HghTg3a33',
    test: 'https://api-sandbox.unionkey.io/covalent/client1-HghTg3a33',
  },
  mempool: {
    prd: 'https://api.unionkey.io/mempool',
    test: 'https://api-sandbox.unionkey.io/mempool',
  },
  getblock: {
    prd: 'https://api.unionkey.io/getblock-{chain}-{network}',
    test: 'https://api-sandbox.unionkey.io/getblock-{chain}-{network}',
  },
  algosigner: {
    prd: 'https://api.unionkey.io/algosigner/{network}/indexer',
    test: 'https://api-sandbox.unionkey.io/algosigner/{network}/indexer',
  },
  tronscan: {
    prd: 'https://api.unionkey.io/tronscan',
    test: 'https://api-sandbox.unionkey.io/tronscan',
  },
  solscan: {
    prd: 'https://api.unionkey.io/solscan',
    test: 'https://api-sandbox.unionkey.io/solscan',
  },
};

let endpointType: 'prd' | 'test' = 'prd';
export const switchTestEndpoint = (isTestEnable?: boolean) => {
  endpointType = isTestEnable ? 'test' : 'prd';
};

switchTestEndpoint(false);

export const getFiatEndpoint = () => endpointsMap.fiat[endpointType];
export const getSocketEndpoint = () => endpointsMap.wss[endpointType];
export const getCovalentApiEndpoint = () => endpointsMap.covalent[endpointType];
export const getTronScanEndpoint = () => endpointsMap.tronscan[endpointType];
export const getSolScanEndpoint = () => endpointsMap.solscan[endpointType];

export function getMempoolEndpoint({
  network,
}: {
  network: 'mainnet' | 'testnet';
}) {
  const networkPath = network === 'mainnet' ? '' : network;
  return [endpointsMap.mempool[endpointType], networkPath]
    .filter(Boolean)
    .join('/');
}

export function getGetblockEndpoint({
  chain,
  network,
}: {
  chain: 'btc';
  network: 'mainnet' | 'testnet';
}) {
  return endpointsMap.getblock[endpointType]
    .replace('{chain}', chain)
    .replace('{network}', network);
}

export function getAlgoSignerEndpoint({
  network,
}: {
  network: 'mainnet' | 'testnet';
}) {
  return endpointsMap.algosigner[endpointType].replace('{network}', network);
}
