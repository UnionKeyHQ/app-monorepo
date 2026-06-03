const http = require('http');

const host =
  process.env.UNIONKEY_API_HOST_BIND ||
  process.env.UNIONKEY_WALLET_API_HOST ||
  '0.0.0.0';
const port = Number(
  process.env.UNIONKEY_API_PORT ||
    process.env.UNIONKEY_WALLET_API_PORT ||
    3443,
);

const marketTokenSeeds = [
  ['bitcoin', 'Bitcoin', 'BTC', 70_629.36, 1_415_249_174_414, 45_691_496_735, 8],
  ['ethereum', 'Ethereum', 'ETH', 1_999.91, 241_400_000_000, 19_367_644_553, 18],
  ['tether', 'Tether', 'USDT', 0.9987, 111_000_000_000, 50_000_000_000, 6],
  ['binancecoin', 'BNB', 'BNB', 655.9, 89_500_000_000, 992_058_732, 18],
  ['ripple', 'XRP', 'XRP', 1.36, 84_200_000_000, 1_890_000_000, 6],
  ['solana', 'Solana', 'SOL', 85.88, 49_237_388_480, 3_959_281_316, 9],
  ['usd-coin', 'USDC', 'USDC', 1, 32_000_000_000, 5_000_000_000, 6],
  ['dogecoin', 'Dogecoin', 'DOGE', 0.103, 15_200_000_000, 900_000_000, 8],
  ['toncoin', 'Toncoin', 'TON', 2.1, 8_100_000_000, 260_000_000, 9],
  ['cardano', 'Cardano', 'ADA', 0.25, 9_000_000_000, 230_000_000, 6],
  ['tron', 'TRON', 'TRX', 0.3633, 31_200_000_000, 690_000_000, 6],
  ['avalanche-2', 'Avalanche', 'AVAX', 18.5, 7_800_000_000, 410_000_000, 18],
  ['chainlink', 'Chainlink', 'LINK', 12.8, 8_200_000_000, 420_000_000, 18],
  ['shiba-inu', 'Shiba Inu', 'SHIB', 0.0000088, 5_200_000_000, 180_000_000, 18],
  ['polkadot', 'Polkadot', 'DOT', 2.7, 4_100_000_000, 210_000_000, 10],
  ['litecoin', 'Litecoin', 'LTC', 52, 3_900_000_000, 420_000_000, 8],
  ['bitcoin-cash', 'Bitcoin Cash', 'BCH', 310, 6_200_000_000, 360_000_000, 8],
  ['uniswap', 'Uniswap', 'UNI', 5.8, 3_500_000_000, 120_000_000, 18],
  ['near', 'NEAR Protocol', 'NEAR', 2.1, 2_700_000_000, 160_000_000, 24],
  ['internet-computer', 'Internet Computer', 'ICP', 4.8, 2_300_000_000, 80_000_000, 8],
  ['aptos', 'Aptos', 'APT', 3.4, 2_100_000_000, 150_000_000, 8],
  ['ethereum-classic', 'Ethereum Classic', 'ETC', 14.9, 2_300_000_000, 170_000_000, 18],
  ['sui', 'Sui', 'SUI', 1.55, 5_000_000_000, 520_000_000, 9],
  ['arbitrum', 'Arbitrum', 'ARB', 0.28, 1_400_000_000, 160_000_000, 18],
  ['optimism', 'Optimism', 'OP', 0.48, 830_000_000, 90_000_000, 18],
  ['cosmos', 'Cosmos Hub', 'ATOM', 3.4, 1_500_000_000, 85_000_000, 6],
  ['stellar', 'Stellar', 'XLM', 0.22, 6_900_000_000, 180_000_000, 7],
  ['filecoin', 'Filecoin', 'FIL', 1.9, 1_300_000_000, 95_000_000, 18],
  ['hedera-hashgraph', 'Hedera', 'HBAR', 0.096, 3_800_000_000, 100_000_000, 8],
  ['vechain', 'VeChain', 'VET', 0.015, 1_300_000_000, 42_000_000, 18],
  ['render-token', 'Render', 'RNDR', 2.5, 1_300_000_000, 95_000_000, 18],
  ['maker', 'Maker', 'MKR', 1_650, 1_450_000_000, 65_000_000, 18],
  ['aave', 'Aave', 'AAVE', 180, 2_700_000_000, 260_000_000, 18],
  ['the-graph', 'The Graph', 'GRT', 0.075, 740_000_000, 32_000_000, 18],
  ['algorand', 'Algorand', 'ALGO', 0.13, 1_100_000_000, 54_000_000, 6],
  ['fantom', 'Fantom', 'FTM', 0.32, 900_000_000, 75_000_000, 18],
  ['injective-protocol', 'Injective', 'INJ', 9.4, 940_000_000, 72_000_000, 18],
  ['immutable-x', 'Immutable', 'IMX', 0.62, 1_150_000_000, 50_000_000, 18],
  ['theta-token', 'Theta Network', 'THETA', 0.5, 500_000_000, 24_000_000, 18],
  ['tezos', 'Tezos', 'XTZ', 0.58, 610_000_000, 28_000_000, 6],
  ['eos', 'EOS', 'EOS', 0.32, 500_000_000, 60_000_000, 4],
  ['flow', 'Flow', 'FLOW', 0.28, 450_000_000, 22_000_000, 8],
  ['lido-dao', 'Lido DAO', 'LDO', 0.72, 650_000_000, 48_000_000, 18],
  ['curve-dao-token', 'Curve DAO', 'CRV', 0.22, 300_000_000, 60_000_000, 18],
  ['pancakeswap-token', 'PancakeSwap', 'CAKE', 2.1, 620_000_000, 42_000_000, 18],
  ['1inch', '1inch', '1INCH', 0.16, 230_000_000, 24_000_000, 18],
  ['compound-governance-token', 'Compound', 'COMP', 42, 390_000_000, 31_000_000, 18],
  ['rocket-pool', 'Rocket Pool', 'RPL', 4.8, 100_000_000, 4_000_000, 18],
  ['blur', 'Blur', 'BLUR', 0.07, 160_000_000, 35_000_000, 18],
];

const tokenPalette = [
  ['#f7931a', '#fff3d6'],
  ['#627eea', '#eef1ff'],
  ['#26a17b', '#e8fff7'],
  ['#f0b90b', '#fff8d8'],
  ['#14f195', '#e8fff7'],
  ['#2775ca', '#eaf3ff'],
  ['#23292f', '#f1f3f5'],
  ['#c2a633', '#fff9dc'],
  ['#0098ea', '#e8f7ff'],
  ['#0033ad', '#eaf0ff'],
];

const buildTokenIconUrl = (symbol, index) => {
  const [foreground, background] = tokenPalette[index % tokenPalette.length];
  const label = String(symbol).slice(0, 4).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="${background}"/><circle cx="48" cy="48" r="35" fill="${foreground}"/><text x="48" y="55" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${label.length > 3 ? 20 : 24}" font-weight="700" fill="#fff">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const round = (value, decimals = 2) => Number(value.toFixed(decimals));

const isStableToken = (symbol) => ['USDT', 'USDC'].includes(String(symbol));

const buildChangePercent = (index, range, offset = 0) => {
  const direction = index % 4 === 0 || index % 5 === 0 ? -1 : 1;
  return round(direction * (((index * 17 + offset) % range) / 10 + 0.2), 2);
};

const buildSparkline = (price, index, points = 100, symbol = '') => {
  const stable = isStableToken(symbol);
  const trend = stable ? buildChangePercent(index, 4, 1) / 1000 : buildChangePercent(index, 90, 11) / 100;
  const start = price * (1 - trend);
  return Array.from({ length: points }, (_, pointIndex) => {
    const progress = points <= 1 ? 1 : pointIndex / (points - 1);
    const primaryWave =
      Math.sin((pointIndex + index) / 9) * price * (stable ? 0.00045 : 0.006);
    const secondaryWave =
      Math.sin((pointIndex * 1.7 + index) / 17) *
      price *
      (stable ? 0.0002 : 0.0025);
    const wave = primaryWave + secondaryWave;
    return round(start + (price - start) * progress + wave, price < 1 ? 8 : 4);
  });
};

const buildMarketChart = (token, days = '1', points = 200) => {
  const daysNumber = Number(days) || 1;
  const durationMs =
    String(days).toLowerCase() === 'max'
      ? 365 * 24 * 60 * 60 * 1000
      : daysNumber * 24 * 60 * 60 * 1000;
  const now = Date.now();
  return buildSparkline(
    token.price,
    token.serialNumber,
    points,
    token.symbol,
  ).map(
    (price, index) => [
      now - durationMs + Math.floor((durationMs / Math.max(points - 1, 1)) * index),
      price,
    ],
  );
};

const normalizeCandleShape = ({ open, high, low, close, symbol }) => {
  const stable = isStableToken(symbol);
  const decimals = Math.max(open, close, high, low) < 1 ? 8 : 4;
  const minBodyRatio = stable ? 0.00008 : 0.0012;
  const minBody = Math.max(
    Math.max(high - low, Math.max(open, close) * minBodyRatio) * 0.38,
    Math.max(open, close) * minBodyRatio,
  );
  let shapedClose = close;
  if (Math.abs(close - open) < minBody) {
    const direction = close >= open ? 1 : -1;
    shapedClose = open + direction * minBody;
  }
  const shapedHigh = Math.max(high, open, shapedClose);
  const shapedLow = Math.min(low, open, shapedClose);
  return {
    open: round(open, decimals),
    high: round(shapedHigh, decimals),
    low: round(shapedLow, decimals),
    close: round(shapedClose, decimals),
  };
};

const buildMarketCandles = (token, days = '1', points = 120) => {
  const line = buildMarketChart(token, days, points);
  return line.map(([time, close], index) => {
    const open = index === 0 ? close : line[index - 1][1];
    const volatility = isStableToken(token.symbol) ? 0.00035 : 0.006;
    const wick = 1 + ((index % 7) + 1) * volatility * 0.18;
    const high = Math.max(open, close) * wick;
    const low = Math.min(open, close) / wick;
    const volumeBase = token.totalVolume / Math.max(points, 1);
    const volumeWave = 0.65 + ((index * 19) % 80) / 100;
    const candle = normalizeCandleShape({
      open,
      high,
      low,
      close,
      symbol: token.symbol,
    });
    return [
      time,
      candle.open,
      candle.high,
      candle.low,
      candle.close,
      round(volumeBase * volumeWave, 2),
    ];
  });
};

const marketTokens = marketTokenSeeds.map(
  (
    [coingeckoId, name, symbol, price, marketCap, totalVolume, decimals],
    index,
  ) => {
    const iconUrl = buildTokenIconUrl(symbol, index);
    const stable = isStableToken(symbol);
    const priceChangePercentage1H = stable
      ? round(buildChangePercent(index, 5, 3) / 100, 2)
      : buildChangePercent(index, 25, 3);
    const priceChangePercentage24H = stable
      ? round(buildChangePercent(index, 8, 7) / 100, 2)
      : buildChangePercent(index, 80, 7);
    const priceChangePercentage7D = stable
      ? round(buildChangePercent(index, 12, 13) / 100, 2)
      : buildChangePercent(index, 160, 13);
    return {
      coingeckoId,
      sortIndex: index + 1,
      name,
      serialNumber: index + 1,
      price,
      totalVolume,
      marketCap,
      symbol,
      decimals,
      iconUrl,
      isSupportBuy: false,
      image: iconUrl,
      priceChangePercentage1H,
      priceChangePercentage24H,
      priceChangePercentage7D,
      priceChangePercentage14D: round(priceChangePercentage7D * 1.4, 2),
      priceChangePercentage30D: round(priceChangePercentage7D * 2.2, 2),
      priceChangePercentage1Y: round(priceChangePercentage7D * 8, 2),
      sparkline: buildSparkline(price, index, 100, symbol),
      lastUpdated: new Date().toISOString(),
    };
  },
);

let liveMarketTokens = marketTokens;
let marketTokensFetchedAt = 0;
let marketTokensFetchPromise = null;
const liveMarketCharts = new Map();
const MARKET_CACHE_TTL = 60 * 1000;

const mapCoinGeckoMarketToken = (item, index) => {
  const fallback =
    marketTokens.find((token) => token.coingeckoId === item.id) ||
    marketTokens[index] ||
    marketTokens[0];
  const symbol = String(item.symbol || fallback.symbol).toUpperCase();
  const iconUrl = item.image || fallback.iconUrl || buildTokenIconUrl(symbol, index);
  return {
    ...fallback,
    coingeckoId: item.id || fallback.coingeckoId,
    sortIndex: index + 1,
    name: item.name || fallback.name,
    serialNumber: item.market_cap_rank || index + 1,
    price: Number(item.current_price ?? fallback.price),
    totalVolume: Number(item.total_volume ?? fallback.totalVolume),
    marketCap: Number(item.market_cap ?? fallback.marketCap),
    symbol,
    iconUrl,
    image: iconUrl,
    priceChangePercentage1H: Number(
      item.price_change_percentage_1h_in_currency ??
        fallback.priceChangePercentage1H,
    ),
    priceChangePercentage24H: Number(
      item.price_change_percentage_24h_in_currency ??
        item.price_change_percentage_24h ??
        fallback.priceChangePercentage24H,
    ),
    priceChangePercentage7D: Number(
      item.price_change_percentage_7d_in_currency ??
        fallback.priceChangePercentage7D,
    ),
    priceChangePercentage14D: fallback.priceChangePercentage14D,
    priceChangePercentage30D: Number(
      item.price_change_percentage_30d_in_currency ??
        fallback.priceChangePercentage30D,
    ),
    priceChangePercentage1Y: Number(
      item.price_change_percentage_1y_in_currency ??
        fallback.priceChangePercentage1Y,
    ),
    sparkline:
      item.sparkline_in_7d?.price?.length > 0
        ? item.sparkline_in_7d.price.map((price) =>
            round(Number(price), Number(price) < 1 ? 8 : 4),
          )
        : fallback.sparkline,
    lastUpdated: item.last_updated || new Date().toISOString(),
  };
};

const fetchCoinGeckoMarketTokens = async () => {
  const ids = marketTokenSeeds.map(([id]) => id).join(',');
  const params = new URLSearchParams({
    vs_currency: 'usd',
    ids,
    order: 'market_cap_desc',
    per_page: String(marketTokenSeeds.length),
    page: '1',
    sparkline: 'true',
    price_change_percentage: '1h,24h,7d,30d,1y',
    locale: 'en',
    precision: 'full',
  });
  const endpoint = `https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`;
  const response = await fetch(endpoint, {
    headers: {
      accept: 'application/json',
      'user-agent': 'UnionKeyWalletLocalApi/1.0',
    },
  });
  if (!response.ok) {
    throw new Error(`CoinGecko market API failed: ${response.status}`);
  }
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('CoinGecko market API returned empty data');
  }
  return data.map(mapCoinGeckoMarketToken);
};

const ensureLiveMarketTokens = async () => {
  if (Date.now() - marketTokensFetchedAt < MARKET_CACHE_TTL) {
    return liveMarketTokens;
  }
  if (!marketTokensFetchPromise) {
    marketTokensFetchPromise = fetchCoinGeckoMarketTokens()
      .then((tokens) => {
        liveMarketTokens = tokens;
        marketTokensFetchedAt = Date.now();
        console.log(`[UnionKey API] CoinGecko market cache updated: ${tokens.length} tokens`);
        return liveMarketTokens;
      })
      .catch((error) => {
        console.warn(`[UnionKey API] CoinGecko market cache fallback: ${error.message}`);
        return liveMarketTokens;
      })
      .finally(() => {
        marketTokensFetchPromise = null;
      });
  }
  return marketTokensFetchPromise;
};

const getMarketTokens = () => liveMarketTokens;

const fetchCoinGeckoMarketChart = async ({ coingeckoId, days, points }) => {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    days: String(days || '1'),
    precision: 'full',
  });
  const endpoint = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
    coingeckoId,
  )}/market_chart?${params.toString()}`;
  const response = await fetch(endpoint, {
    headers: {
      accept: 'application/json',
      'user-agent': 'UnionKeyWalletLocalApi/1.0',
    },
  });
  if (!response.ok) {
    throw new Error(`CoinGecko chart API failed: ${response.status}`);
  }
  const data = await response.json();
  const prices = Array.isArray(data.prices) ? data.prices : [];
  const volumes = Array.isArray(data.total_volumes) ? data.total_volumes : [];
  if (!prices.length) {
    throw new Error('CoinGecko chart API returned empty data');
  }
  const targetPoints = Math.min(Number(points) || 120, prices.length);
  const bucketSize = Math.max(Math.ceil(prices.length / targetPoints), 1);
  const candles = [];
  for (let index = 0; index < prices.length; index += bucketSize) {
    const priceBucket = prices.slice(index, index + bucketSize);
    if (!priceBucket.length) {
      continue;
    }
    const volumeBucket = volumes.slice(index, index + bucketSize);
    const values = priceBucket.map(([, price]) => Number(price));
    const open = values[0];
    const close = values[values.length - 1];
    const high = Math.max(...values);
    const low = Math.min(...values);
    const volume = volumeBucket.reduce(
      (sum, [, value]) => sum + Number(value || 0),
      0,
    );
    const time = Number(priceBucket[priceBucket.length - 1][0]);
    const candle = normalizeCandleShape({
      open,
      high,
      low,
      close,
      symbol:
        marketTokens.find((token) => token.coingeckoId === coingeckoId)
          ?.symbol || '',
    });
    candles.push([
      time,
      candle.open,
      candle.high,
      candle.low,
      candle.close,
      round(volume / Math.max(volumeBucket.length, 1), 2),
    ]);
  }
  return candles.slice(-targetPoints);
};

const getMarketChart = async ({ coingeckoId, days, points }) => {
  const cacheKey = `${coingeckoId}:${days}:${points || ''}`;
  const cached = liveMarketCharts.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < MARKET_CACHE_TTL) {
    return cached.data;
  }
  try {
    const data = await fetchCoinGeckoMarketChart({
      coingeckoId,
      days,
      points,
    });
    liveMarketCharts.set(cacheKey, {
      data,
      fetchedAt: Date.now(),
    });
    return data;
  } catch (error) {
    console.warn(`[UnionKey API] CoinGecko chart fallback: ${error.message}`);
    const token = findMarketToken(coingeckoId);
    return buildMarketCandles(token, days, points);
  }
};

const tokenCatalog = {
  'evm--1': {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
    address: '',
    logoURI: 'https://uni.unionkey-asset.com/static/chain/eth.png',
    isNative: true,
    coingeckoId: 'ethereum',
  },
  'btc--0': {
    decimals: 8,
    name: 'Bitcoin',
    symbol: 'BTC',
    address: '',
    logoURI: 'https://uni.unionkey-asset.com/static/chain/btc.png',
    isNative: true,
    coingeckoId: 'bitcoin',
  },
};

const serverNetworks = [
  {
    impl: 'evm',
    chainId: '8453',
    id: 'evm--8453',
    name: 'Base',
    symbol: 'ETH',
    code: 'base',
    shortcode: 'base',
    shortname: 'BASE',
    decimals: 18,
    feeMeta: {
      decimals: 9,
      symbol: 'Gwei',
      isEIP1559FeeEnabled: true,
      isWithL1BaseFee: false,
    },
    status: 'LISTED',
    isTestnet: false,
    logoURI: 'https://uni.unionkey-asset.com/static/chain/base.png',
    defaultEnabled: true,
    backendIndex: true,
    explorerURL: 'https://basescan.org',
  },
];

const featuredDapps = [
  {
    dappId: 'unionkey-uniswap',
    name: 'Uniswap',
    url: 'https://app.uniswap.org',
    logo: 'https://app.uniswap.org/favicon.png',
    description: 'Decentralized trading protocol.',
    networkIds: ['evm--1', 'evm--8453'],
    categoryIds: ['swap'],
    tagIds: ['defi'],
    tags: [{ tagId: 'defi', name: 'DeFi', type: 'success' }],
    order: 1,
  },
  {
    dappId: 'unionkey-opensea',
    name: 'OpenSea',
    url: 'https://opensea.io',
    logo: 'https://opensea.io/favicon.ico',
    description: 'NFT marketplace.',
    networkIds: ['evm--1'],
    categoryIds: ['nft'],
    tagIds: ['nft'],
    tags: [{ tagId: 'nft', name: 'NFT', type: 'info' }],
    order: 2,
  },
];

const serviceNames = [
  'wallet',
  'utility',
  'swap',
  'earn',
  'notification',
  'prime',
  'rebate',
  'lightning',
];

const ok = (data) => ({
  code: 0,
  message: 'ok',
  data,
});

const sendJson = (res, statusCode, body) => {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type,Authorization,X-Unionkey-Request-Token,X-UnionKey-Dev-Proxy',
  });
  res.end(payload);
};

const readJsonBody = (req) =>
  new Promise((resolve) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });

const getServiceFromPath = (pathname) => {
  const [, service] = pathname.split('/');
  return serviceNames.includes(service) ? service : 'api';
};

const buildHealth = (service) => ({
  service,
  brand: 'UnionKey',
  status: 'ok',
  timestamp: Date.now(),
});

const findMarketToken = (idOrSymbol) => {
  const value = String(idOrSymbol || '').toLowerCase();
  const tokens = getMarketTokens();
  return (
    tokens.find(
      (token) =>
        token.coingeckoId === value || token.symbol.toLowerCase() === value,
    ) || tokens[0]
  );
};

const getNativeToken = (networkId = 'evm--1') =>
  tokenCatalog[networkId] || tokenCatalog['evm--1'];

const buildTokenDetail = ({ networkId, address }) => {
  const nativeToken = getNativeToken(networkId);
  const isNative = !address;
  const token = isNative
    ? nativeToken
    : {
        decimals: 18,
        name: 'UnionKey Token',
        symbol: 'UKT',
        address,
        logoURI: 'https://uni.unionkey-asset.com/static/logo/unionkey.png',
        isNative: false,
      };
  const price = token.symbol === 'BTC' ? 68000 : token.symbol === 'ETH' ? 3500 : 1;
  return {
    info: {
      ...token,
      uniqueKey: `${networkId}_${token.address || 'native'}`,
      networkId,
    },
    balance: '0',
    balanceParsed: '0',
    fiatValue: '0',
    price,
    price24h: 0,
  };
};

const buildEmptyTokenData = () => ({
  data: [],
  keys: '',
  map: {},
  fiatValue: '0',
});

const buildGasFee = () => ({
  gas: [
    {
      gasPrice: '1000000000',
      gasLimit: '21000',
      gasLimitForDisplay: '21000',
    },
  ],
  gasEIP1559: [
    {
      baseFeePerGas: '1000000000',
      maxFeePerGas: '1200000000',
      maxPriorityFeePerGas: '100000000',
      gasLimit: '21000',
      gasLimitForDisplay: '21000',
      gasPrice: '1000000000',
      confidence: 90,
    },
  ],
});

const buildEmptyPage = () => ({
  data: [],
  list: [],
  next: '',
  total: 0,
  hasNext: false,
});

const buildAccountProfile = ({ accountId = '', networkId = 'evm--1' } = {}) => {
  const nativeToken = getNativeToken(networkId);
  return {
    accountId,
    networkId,
    address: '',
    balance: '0',
    balanceParsed: '0',
    fiatValue: '0',
    nativeToken,
    tokens: buildEmptyTokenData(),
    nfts: buildEmptyPage(),
    history: buildEmptyPage(),
  };
};

const buildDiscoveryCategory = (categoryId, name) => ({
  categoryId,
  name,
  dapps: featuredDapps.filter((dapp) => dapp.categoryIds.includes(categoryId)),
  origin: 'unionkey',
});

const buildHostSecurity = (url) => ({
  host: url,
  level: 'security',
  attackTypes: [],
  phishingSite: false,
  checkSources: [{ name: 'UnionKey mock', riskLevel: 'security' }],
  alert: '',
  projectName: url,
  createdAt: new Date().toISOString(),
  dapp: {
    name: '',
    logo: '',
    description: { text: '' },
    tags: [],
    origins: [],
  },
});

const buildMarketDetail = (id) => {
  const token = findMarketToken(id);
  const currentPrice = token.price;
  const stable = isStableToken(token.symbol);
  const low24h = stable
    ? currentPrice * 0.9985
    : currentPrice * (1 - Math.abs(token.priceChangePercentage24H) / 100);
  const high24h = stable
    ? currentPrice * 1.0015
    : currentPrice * (1 + Math.abs(token.priceChangePercentage24H) / 100);
  const circulatingSupply = Math.floor(token.marketCap / currentPrice);
  const totalSupply = Math.floor(circulatingSupply * 1.12);
  const maxSupply = Math.floor(circulatingSupply * 1.35);
  return {
    name: token.name,
    image: token.image,
    symbol: token.symbol,
    about: `${token.name} market data served by the local UnionKey API. This mock includes price movement, volume, supply, pool and chart data for desktop development.`,
    explorers: [
      {
        contractAddress: token.coingeckoId,
        url: `https://explorer.unionkey.local/token/${token.coingeckoId}`,
        name: 'UnionKey Explorer',
      },
    ],
    links: {
      homePageUrl: `https://www.${token.coingeckoId}.org`,
      discordUrl: '',
      twitterUrl: `https://x.com/${token.symbol}`,
      whitepaper: '',
      telegramUrl: '',
    },
    stats: {
      performance: {
        priceChangePercentage1h: token.priceChangePercentage1H,
        priceChangePercentage24h: token.priceChangePercentage24H,
        priceChangePercentage7d: token.priceChangePercentage7D,
        priceChangePercentage14d: token.priceChangePercentage14D,
        priceChangePercentage30d: token.priceChangePercentage30D,
        priceChangePercentage1y: token.priceChangePercentage1Y,
      },
      marketCap: token.marketCap,
      marketCapRank: token.serialNumber,
      volume24h: token.totalVolume,
      low24h: round(low24h, currentPrice < 1 ? 8 : 4),
      high24h: round(high24h, currentPrice < 1 ? 8 : 4),
      atl: {
        time: new Date(Date.now() - 900 * 24 * 60 * 60 * 1000).toISOString(),
        value: round(
          stable ? currentPrice * 0.985 : currentPrice * 0.22,
          currentPrice < 1 ? 8 : 4,
        ),
      },
      ath: {
        time: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        value: round(
          stable ? currentPrice * 1.015 : currentPrice * 1.85,
          currentPrice < 1 ? 8 : 4,
        ),
      },
      fdv: round(token.marketCap * 1.15, 0),
      circulatingSupply,
      totalSupply,
      maxSupply,
      currentPrice: String(currentPrice),
      lastUpdated: token.lastUpdated,
    },
    fallbackToChart: true,
    detailPlatforms: {
      ethereum: {
        contract_address: token.coingeckoId,
        unionkeyNetworkId: 'evm--1',
        coingeckoNetworkId: 'ethereum',
        tokenAddress: token.coingeckoId,
      },
    },
    platforms: {
      ethereum: token.coingeckoId,
    },
    tickers: [
      {
        localId: '',
        base: token.symbol,
        target: 'USDT',
        market: {
          name: 'UnionKey Swap',
          identifier: 'unionkey-swap',
          has_trading_incentive: false,
        },
        depth_data: {
          '+2%': String(round(token.totalVolume * 0.018, 2)),
          '-2%': String(round(token.totalVolume * 0.016, 2)),
        },
        last: currentPrice,
        last_updated_at: token.lastUpdated,
        logo: token.image,
        volume: token.totalVolume,
        trust_score: 'green',
        bid_ask_spread_percentage: 0.12,
        trade_url: `https://swap.unionkey.local/${token.coingeckoId}`,
      },
    ],
  };
};

const buildMarketV2Token = (token) => {
  const serial = token.serialNumber;
  const trade24hCount = 8000 + serial * 321;
  const buyRatio24h = 0.35 + (serial % 13) / 40;
  const volumeBuyRatio24h = 0.25 + ((serial * 5) % 17) / 34;
  const buyerRatio24h = 0.42 + ((serial * 7) % 11) / 45;
  const buy24hCount = Math.floor(trade24hCount * Math.min(buyRatio24h, 0.78));
  const sell24hCount = trade24hCount - buy24hCount;
  const volumeBuy24h = round(
    token.totalVolume * Math.min(volumeBuyRatio24h, 0.82),
    2,
  );
  const volumeSell24h = round(token.totalVolume - volumeBuy24h, 2);
  const trader24hCount = Math.floor(trade24hCount * (0.52 + (serial % 5) / 20));
  const buyer24hCount = Math.floor(
    trader24hCount * Math.min(buyerRatio24h, 0.8),
  );
  const seller24hCount = trader24hCount - buyer24hCount;
  const holders = Math.floor(token.marketCap / Math.max(token.price, 0.000001) / 10_000);
  return {
    address: token.coingeckoId,
    logoUrl: token.iconUrl,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    marketCap: String(token.marketCap),
    fdv: String(round(token.marketCap * 1.15, 0)),
    tvl: String(round(token.totalVolume * 0.38, 2)),
    holders,
    extraData: {
      website: `https://www.${token.coingeckoId}.org`,
      twitter: `https://x.com/${token.symbol}`,
    },
    price: String(token.price),
    priceChange1hPercent: String(token.priceChangePercentage1H),
    priceChange2hPercent: String(round(token.priceChangePercentage1H * 1.2, 2)),
    priceChange4hPercent: String(round(token.priceChangePercentage1H * 1.8, 2)),
    priceChange8hPercent: String(round(token.priceChangePercentage24H * 0.55, 2)),
    priceChange24hPercent: String(token.priceChangePercentage24H),
    volume1h: String(round(token.totalVolume / 24, 2)),
    volume2h: String(round(token.totalVolume / 12, 2)),
    volume4h: String(round(token.totalVolume / 6, 2)),
    volume8h: String(round(token.totalVolume / 3, 2)),
    volume24h: String(token.totalVolume),
    volume1hChangePercent: String(round(token.priceChangePercentage1H * 0.8, 2)),
    volume2hChangePercent: String(round(token.priceChangePercentage1H, 2)),
    volume4hChangePercent: String(round(token.priceChangePercentage1H * 1.4, 2)),
    volume8hChangePercent: String(round(token.priceChangePercentage24H * 0.45, 2)),
    volume24hChangePercent: String(round(token.priceChangePercentage24H * 0.7, 2)),
    trade5mCount: String(Math.floor(trade24hCount / 288)),
    trade1hCount: String(Math.floor(trade24hCount / 24)),
    trade2hCount: String(Math.floor(trade24hCount / 12)),
    trade4hCount: String(Math.floor(trade24hCount / 6)),
    trade8hCount: String(Math.floor(trade24hCount / 3)),
    trade24hCount: String(trade24hCount),
    buy5mCount: String(Math.floor(buy24hCount / 288)),
    buy1hCount: String(Math.floor(buy24hCount / 24)),
    buy4hCount: String(Math.floor(buy24hCount / 6)),
    buy24hCount: String(buy24hCount),
    sell5mCount: String(Math.floor(sell24hCount / 288)),
    sell1hCount: String(Math.floor(sell24hCount / 24)),
    sell4hCount: String(Math.floor(sell24hCount / 6)),
    sell24hCount: String(sell24hCount),
    buyer5mCount: String(Math.floor(buyer24hCount / 288)),
    buyer1hCount: String(Math.floor(buyer24hCount / 24)),
    buyer4hCount: String(Math.floor(buyer24hCount / 6)),
    buyer24hCount: String(buyer24hCount),
    seller5mCount: String(Math.floor(seller24hCount / 288)),
    seller1hCount: String(Math.floor(seller24hCount / 24)),
    seller4hCount: String(Math.floor(seller24hCount / 6)),
    seller24hCount: String(seller24hCount),
    volumeBuy5m: String(round(volumeBuy24h / 288, 2)),
    volumeBuy1h: String(round(volumeBuy24h / 24, 2)),
    volumeBuy4h: String(round(volumeBuy24h / 6, 2)),
    volumeBuy24h: String(volumeBuy24h),
    volumeSell5m: String(round(volumeSell24h / 288, 2)),
    volumeSell1h: String(round(volumeSell24h / 24, 2)),
    volumeSell4h: String(round(volumeSell24h / 6, 2)),
    volumeSell24h: String(volumeSell24h),
  };
};

const buildMarketPool = (token) => ({
  id: `ethereum_${token.coingeckoId}_usdt`,
  localId: `pool-${token.coingeckoId}`,
  dexLogoUrl: buildTokenIconUrl('UK', token.serialNumber),
  dexName: 'UnionKey Swap',
  baseTokenImageUrl: token.image,
  unionkeyNetworkId: 'evm--1',
  quoteTokenImageUrl: buildTokenIconUrl('USDT', 2),
  type: 'pool',
  attributes: {
    baseTokenPriceUsd: String(token.price),
    baseTokenPriceNativeCurrency: String(round(token.price / 3500, 8)),
    quoteTokenPriceUsd: '1',
    quoteTokenPriceNativeCurrency: '0.00028571',
    baseTokenPriceQuoteToken: String(token.price),
    quoteTokenPriceBaseToken: String(round(1 / Math.max(token.price, 0.000001), 8)),
    address: `0x${Buffer.from(token.coingeckoId).toString('hex').slice(0, 40).padEnd(40, '0')}`,
    name: `${token.symbol} / USDT`,
    poolCreatedAt: new Date(Date.now() - token.serialNumber * 7 * 24 * 60 * 60 * 1000).toISOString(),
    fdvUsd: String(round(token.marketCap * 1.15, 0)),
    market_cap_usd: String(token.marketCap),
    priceChangePercentage: {
      m5: String(round(token.priceChangePercentage1H / 12, 2)),
      h1: String(token.priceChangePercentage1H),
      h6: String(round(token.priceChangePercentage24H / 4, 2)),
      h24: String(token.priceChangePercentage24H),
    },
    transactions: {
      m5: { buys: 8, sells: 7, buyers: 8, sellers: 7 },
      m15: { buys: 20, sells: 18, buyers: 19, sellers: 17 },
      m30: { buys: 42, sells: 37, buyers: 39, sellers: 33 },
      h1: { buys: 83, sells: 76, buyers: 72, sellers: 68 },
      h24: { buys: 1200 + token.serialNumber * 13, sells: 1100 + token.serialNumber * 11, buyers: 980, sellers: 900 },
    },
    volumeUsd: {
      m5: String(round(token.totalVolume / 288, 2)),
      h1: String(round(token.totalVolume / 24, 2)),
      h6: String(round(token.totalVolume / 4, 2)),
      h24: String(token.totalVolume),
    },
    reserveInUsd: String(round(token.totalVolume * 0.38, 2)),
  },
  relationships: {
    baseToken: { data: { id: token.coingeckoId, type: 'token' } },
    quoteToken: { data: { id: 'tether', type: 'token' } },
    dex: { data: { id: 'unionkey-swap', type: 'dex' } },
  },
});

const route = async (req, url, body = {}) => {
  const { pathname, searchParams } = url;
  const service = getServiceFromPath(pathname);
  const isMarketRoute =
    pathname.startsWith('/utility/v1/market/') ||
    pathname.startsWith('/utility/v2/market/');
  if (isMarketRoute) {
    await ensureLiveMarketTokens();
  }

  if (req.method === 'GET' && pathname === '/') {
    return ok(buildHealth('api'));
  }

  if (req.method === 'GET' && /\/v\d+\/health$/.test(pathname)) {
    return ok(buildHealth(service));
  }

  if (req.method === 'GET' && pathname === '/wallet/v1/network/list') {
    return ok(serverNetworks);
  }

  if (req.method === 'GET' && pathname === '/wallet/v1/network/chainlist') {
    const keywords = String(searchParams.get('keywords') || '');
    return ok(
      serverNetworks
        .filter((network) => !keywords || network.chainId === keywords)
        .map((network) => ({
          chainId: network.chainId,
          name: network.name,
          symbol: network.symbol,
          rpc: [],
          explorers: network.explorerURL
            ? [{ url: network.explorerURL, standard: 'EIP3091' }]
            : [],
          nativeCurrency: {
            name: network.symbol,
            symbol: network.symbol,
            decimals: network.decimals,
          },
        })),
    );
  }

  if (
    req.method === 'GET' &&
    /^\/wallet\/v1\/network\/explorer-check\//.test(pathname)
  ) {
    return ok({ available: true });
  }

  if (
    req.method === 'POST' &&
    pathname === '/wallet/v1/account/token/search'
  ) {
    const networkId = body.networkId || 'evm--1';
    const contractList = Array.isArray(body.contractList)
      ? body.contractList
      : [''];
    return ok(
      contractList.map((address) =>
        buildTokenDetail({ networkId, address: address || '' }),
      ),
    );
  }

  if (
    req.method === 'POST' &&
    pathname === '/wallet/v1/account/token/list'
  ) {
    return ok({
      tokens: buildEmptyTokenData(),
      riskTokens: buildEmptyTokenData(),
      smallBalanceTokens: buildEmptyTokenData(),
      accountId: body.accountId,
      networkId: body.networkId,
      isSameAllNetworksAccountData: false,
    });
  }

  if (req.method === 'GET' && pathname === '/wallet/v1/account/get-account') {
    return ok(
      buildAccountProfile({
        accountId: searchParams.get('accountId') || '',
        networkId: searchParams.get('networkId') || 'evm--1',
      }),
    );
  }

  if (req.method === 'POST' && pathname === '/wallet/v1/account/estimate-fee') {
    const nativeToken = getNativeToken(body.networkId);
    return ok({
      ...buildGasFee(),
      isEIP1559: true,
      feeDecimals: 9,
      feeSymbol: nativeToken.symbol === 'BTC' ? 'sats/vB' : 'Gwei',
      nativeDecimals: nativeToken.decimals,
      nativeSymbol: nativeToken.symbol,
      nativeTokenPrice: {
        price: nativeToken.symbol === 'BTC' ? 68000 : 3500,
        price24h: 0,
      },
    });
  }

  if (
    req.method === 'POST' &&
    pathname === '/wallet/v1/account/estimate-fee-batch'
  ) {
    const encodedTxList = Array.isArray(body.encodedTxList)
      ? body.encodedTxList
      : [{}];
    const nativeToken = getNativeToken(body.networkId);
    return ok({
      isEIP1559: true,
      feeDecimals: 9,
      feeSymbol: nativeToken.symbol === 'BTC' ? 'sats/vB' : 'Gwei',
      nativeDecimals: nativeToken.decimals,
      nativeSymbol: nativeToken.symbol,
      baseFee: '1000000000',
      nativeTokenPrice: {
        price: nativeToken.symbol === 'BTC' ? 68000 : 3500,
        price24h: 0,
      },
      result: encodedTxList.map(() => buildGasFee()),
    });
  }

  if (
    req.method === 'POST' &&
    pathname === '/wallet/v1/account/history/detail'
  ) {
    return ok({
      data: null,
      tokens: {},
      nfts: {},
      addressMap: {},
    });
  }

  if (
    req.method === 'POST' &&
    pathname === '/wallet/v1/account/history/list'
  ) {
    return ok({
      data: [],
      tokens: {},
      nfts: {},
      addressMap: {},
    });
  }

  if (req.method === 'GET' && pathname === '/wallet/v1/account/badges') {
    return ok({});
  }

  if (req.method === 'GET' && pathname === '/wallet/v1/account/defi/list') {
    return ok([]);
  }

  if (req.method === 'GET' && pathname === '/wallet/v1/fiat-pay/list') {
    return ok([]);
  }

  if (req.method === 'GET' && pathname === '/wallet/v1/account/resolve-name') {
    return ok({ address: '', name: searchParams.get('name') || '' });
  }

  if (req.method === 'GET' && pathname === '/wallet/v1/account/nft/list') {
    return ok({
      data: [],
      next: '',
      total: 0,
    });
  }

  if (req.method === 'POST' && pathname === '/wallet/v1/account/nft/detail') {
    return ok({
      data: [],
      nfts: {},
    });
  }

  if (req.method === 'GET' && pathname === '/wallet/v1/account/validate-address') {
    return ok({
      isValid: true,
      normalizedAddress: searchParams.get('address') || '',
      displayAddress: searchParams.get('address') || '',
    });
  }

  if (
    req.method === 'POST' &&
    pathname === '/wallet/v1/account/validate-address-batch'
  ) {
    const addresses = Array.isArray(body.addresses) ? body.addresses : [];
    return ok(
      addresses.map((address) => ({
        address,
        isValid: true,
        normalizedAddress: address,
        displayAddress: address,
      })),
    );
  }

  if (
    req.method === 'POST' &&
    [
      '/wallet/v1/account/parse-transaction',
      '/wallet/v1/account/parse-signature',
      '/wallet/v1/account/pre-send-transaction',
      '/wallet/v1/account/send-transaction',
    ].includes(pathname)
  ) {
    return ok({
      isScam: false,
      isRisky: false,
      txid: body.txid || '',
      encodedTx: body.encodedTx || null,
      decodedTx: null,
    });
  }

  if (
    req.method === 'POST' &&
    pathname === '/wallet/v1/network/raw-transaction/list'
  ) {
    return ok([]);
  }

  if (
    req.method === 'POST' &&
    ['/wallet/v1/proxy/wallet', '/wallet/v1/proxy/network'].includes(pathname)
  ) {
    const requests = Array.isArray(body) ? body : [];
    return ok(requests.map(() => ({})));
  }

  if (req.method === 'POST' && pathname === '/wallet/v1/network/sign-typed-data') {
    return ok({ accepted: true });
  }

  if (
    req.method === 'GET' &&
    pathname === '/utility/v1/currency/exchange-rates/map'
  ) {
    return ok({
      USD: { id: 'USD', name: 'US Dollar', symbol: '$', unit: '$', rate: 1 },
      CNY: { id: 'CNY', name: 'Chinese Yuan', symbol: '¥', unit: '¥', rate: 7.2 },
      EUR: { id: 'EUR', name: 'Euro', symbol: '€', unit: '€', rate: 0.92 },
    });
  }

  if (req.method === 'GET' && pathname === '/utility/v1/setting') {
    return ok([]);
  }

  if (req.method === 'POST' && pathname === '/utility/v1/track') {
    return ok({ accepted: true });
  }

  if (
    req.method === 'GET' &&
    pathname === '/utility/v1/app-update/electron-feed-url'
  ) {
    return ok({
      url: '',
      enabled: false,
      latestVersion: '',
    });
  }

  if (req.method === 'GET' && pathname === '/utility/v1/firmware/detail') {
    return ok({
      version: '',
      changelog: [],
      forceUpdate: false,
      firmware: null,
      bootloader: null,
      resource: null,
    });
  }

  if (
    req.method === 'GET' &&
    pathname === '/utility/v1/discover/dapp/homepage'
  ) {
    const categories = [
      buildDiscoveryCategory('swap', 'Swap'),
      buildDiscoveryCategory('nft', 'NFT'),
    ];
    return ok({
      banners: [],
      categories,
      trending: featuredDapps,
      hot: featuredDapps,
    });
  }

  if (
    req.method === 'GET' &&
    pathname === '/utility/v1/discover/category/list'
  ) {
    return ok([
      buildDiscoveryCategory('swap', 'Swap'),
      buildDiscoveryCategory('nft', 'NFT'),
    ]);
  }

  if (req.method === 'GET' && pathname === '/utility/v1/discover/dapp/list') {
    const category = searchParams.get('category');
    const data = category
      ? featuredDapps.filter((dapp) => dapp.categoryIds.includes(category))
      : featuredDapps;
    return ok({ data, next: '' });
  }

  if (req.method === 'GET' && pathname === '/utility/v1/discover/dapp/search') {
    const keyword = String(searchParams.get('keyword') || '').toLowerCase();
    const data = featuredDapps.filter(
      (dapp) =>
        dapp.name.toLowerCase().includes(keyword) ||
        dapp.url.toLowerCase().includes(keyword),
    );
    return ok(data);
  }

  if (req.method === 'GET' && pathname === '/utility/v1/discover/check-host') {
    return ok(buildHostSecurity(searchParams.get('url') || ''));
  }

  if (req.method === 'GET' && pathname === '/utility/v1/discover/icon') {
    return ok({ icon: '' });
  }

  if (
    req.method === 'GET' &&
    pathname === '/utility/v1/market/category/list'
  ) {
    return ok([
      {
        categoryId: 'unionkey-search-trending',
        coingeckoIds: getMarketTokens().map((token) => token.coingeckoId),
        name: 'Trending',
        type: 'market',
        recommendedTokens: getMarketTokens(),
        defaultSelected: true,
        enable: true,
        origin: 'unionkey',
        sequenceId: 0,
      },
      {
        categoryId: 'all',
        coingeckoIds: getMarketTokens().map((token) => token.coingeckoId),
        name: 'All',
        type: 'market',
        recommendedTokens: getMarketTokens(),
        defaultSelected: true,
        enable: true,
        origin: 'unionkey',
        sequenceId: 1,
      },
    ]);
  }

  if (req.method === 'GET' && pathname === '/utility/v1/market/tokens') {
    const ids = searchParams.get('ids');
    const sparklinePoints = Number(searchParams.get('sparklinePoints') || 100);
    const withSparklinePoints = (token) => ({
      ...token,
      sparkline: buildSparkline(
        token.price,
        token.serialNumber,
        sparklinePoints,
        token.symbol,
      ),
    });
    const tokens = getMarketTokens();
    if (!ids) return ok(tokens.map(withSparklinePoints));
    const idSet = new Set(ids.split(',').map((id) => id.trim().toLowerCase()));
    return ok(
      tokens
        .filter((token) => idSet.has(token.coingeckoId))
        .map(withSparklinePoints),
    );
  }

  if (req.method === 'GET' && pathname === '/utility/v1/market/detail') {
    return ok(buildMarketDetail(searchParams.get('id')));
  }

  if (req.method === 'GET' && pathname === '/utility/v1/market/pools') {
    const query = searchParams.get('query');
    const token = findMarketToken(query);
    return ok([buildMarketPool(token)]);
  }

  if (req.method === 'GET' && pathname === '/utility/v1/market/token/chart') {
    const coingeckoId = searchParams.get('coingeckoId');
    const days = searchParams.get('days') || '1';
    const points = Number(searchParams.get('points') || 200);
    return ok(await getMarketChart({ coingeckoId, days, points }));
  }

  if (req.method === 'GET' && pathname === '/utility/v1/market/search') {
    const query = String(searchParams.get('query') || '').toLowerCase();
    return ok(
      getMarketTokens()
        .filter(
          (token) =>
            token.name.toLowerCase().includes(query) ||
            token.symbol.toLowerCase().includes(query) ||
            token.coingeckoId.includes(query),
        )
        .map((token) => token.coingeckoId),
    );
  }

  if (req.method === 'GET' && pathname === '/utility/v2/market/chains') {
    return ok({
      list: [
        {
          networkId: 'evm--1',
          name: 'Ethereum',
          logoUrl: buildTokenIconUrl('ETH', 1),
          explorerUrl: 'https://etherscan.io',
        },
        {
          networkId: 'evm--8453',
          name: 'Base',
          logoUrl: buildTokenIconUrl('BASE', 3),
          explorerUrl: 'https://basescan.org',
        },
        {
          networkId: 'btc--0',
          name: 'Bitcoin',
          logoUrl: buildTokenIconUrl('BTC', 0),
          explorerUrl: 'https://mempool.space',
        },
      ],
      total: 3,
    });
  }

  if (req.method === 'GET' && pathname === '/utility/v2/market/token/list') {
    const page = Math.max(Number(searchParams.get('page') || 1), 1);
    const limit = Math.max(Number(searchParams.get('limit') || 50), 1);
    const sortBy = searchParams.get('sortBy') || 'marketCap';
    const sortType = searchParams.get('sortType') === 'asc' ? 'asc' : 'desc';
    const sortValue = (token) => {
      if (sortBy === 'price') return token.price;
      if (sortBy === 'change24h') return token.priceChangePercentage24H;
      if (sortBy === 'turnover' || sortBy === 'volume24h') return token.totalVolume;
      return token.marketCap;
    };
    const sortedTokens = [...getMarketTokens()].sort((a, b) => {
      const result = sortValue(a) - sortValue(b);
      return sortType === 'asc' ? result : -result;
    });
    const start = (page - 1) * limit;
    const pagedTokens = sortedTokens.slice(start, start + limit);
    return ok({
      list: pagedTokens.map(buildMarketV2Token),
      hasNext: start + limit < sortedTokens.length,
    });
  }

  if (req.method === 'GET' && pathname === '/utility/v2/market/token/detail') {
    const token = findMarketToken(searchParams.get('tokenAddress'));
    return ok({
      token: buildMarketV2Token(token),
    });
  }

  if (req.method === 'GET' && pathname === '/swap/v1/networks') {
    return ok([]);
  }

  if (req.method === 'GET' && pathname === '/swap/v1/tokens') {
    const networkId = searchParams.get('networkId') || 'evm--1';
    const nativeToken = getNativeToken(networkId);
    return ok([
      {
        networkId,
        contractAddress: nativeToken.address,
        symbol: nativeToken.symbol,
        name: nativeToken.name,
        decimals: nativeToken.decimals,
        logoURI: nativeToken.logoURI,
        balance: '0',
        balanceParsed: '0',
        fiatValue: '0',
        price: nativeToken.symbol === 'BTC' ? 68000 : 3500,
        isNative: true,
      },
    ]);
  }

  if (req.method === 'GET' && pathname === '/swap/v1/token/detail') {
    const networkId = searchParams.get('networkId') || 'evm--1';
    const contractAddress = searchParams.get('contractAddress') || '';
    const token = buildTokenDetail({ networkId, address: contractAddress });
    return ok([
      {
        networkId,
        contractAddress,
        symbol: token.info.symbol,
        name: token.info.name,
        decimals: token.info.decimals,
        logoURI: token.info.logoURI,
        balance: token.balance,
        balanceParsed: token.balanceParsed,
        fiatValue: token.fiatValue,
        price: token.price,
        isNative: token.info.isNative,
      },
    ]);
  }

  if (req.method === 'GET' && pathname === '/swap/v1/quote') {
    return ok([]);
  }

  if (req.method === 'POST' && pathname === '/swap/v1/build_tx') {
    return ok({
      tx: null,
      encodedTx: null,
      allowanceResult: null,
      source: 'unionkey-mock',
    });
  }

  if (req.method === 'POST' && pathname === '/swap/v1/build-tx') {
    return ok({
      tx: null,
      encodedTx: null,
      allowanceResult: null,
      source: 'unionkey-mock',
    });
  }

  if (req.method === 'POST' && pathname === '/swap/v1/state-tx') {
    return ok({
      state: 'PENDING',
      status: 'PENDING',
      txId: body.txId || '',
    });
  }

  if (req.method === 'GET' && pathname === '/swap/v1/check-support') {
    return ok([
      {
        networkId: searchParams.get('networkId') || '',
        support: false,
        supportCrossChainSwap: false,
        supportSingleSwap: false,
        supportLimit: false,
      },
    ]);
  }

  if (req.method === 'GET' && pathname === '/swap/v1/allowance') {
    return ok({
      allowance: '0',
      isApproved: false,
      approveAddress: '',
    });
  }

  if (req.method === 'GET' && pathname === '/swap/v1/providers/list') {
    return ok([]);
  }

  if (req.method === 'POST' && pathname === '/swap/v1/limit-orders') {
    return ok({
      data: [],
      next: '',
    });
  }

  if (req.method === 'POST' && pathname === '/swap/v1/cancel-limit-orders') {
    return ok({ success: true });
  }

  if (req.method === 'GET' && pathname === '/swap/v1/limit-market-price') {
    return ok({
      price: '0',
      rate: '0',
    });
  }

  if (req.method === 'GET' && pathname === '/swap/v1/speed-config') {
    return ok({
      enabled: false,
      providers: [],
    });
  }

  if (req.method === 'POST' && pathname === '/swap/v1/build-tx/speed') {
    return ok({
      tx: null,
      encodedTx: null,
    });
  }

  if (req.method === 'GET' && pathname === '/utility/v1/earn-banner/list') {
    return ok([]);
  }

  if (pathname.startsWith('/earn/v1/') || pathname.startsWith('/earn/v2/')) {
    if (pathname.includes('/allowance')) return ok({ allowance: '0' });
    if (pathname.includes('/list') || pathname.includes('/histories')) {
      return ok({ data: [], next: '', total: 0 });
    }
    if (pathname.includes('/detail')) return ok({});
    if (pathname.includes('/overview')) return ok({});
    if (pathname.includes('/available-assets')) return ok([]);
    if (pathname.includes('/check-amount')) return ok({ available: false });
    if (pathname.includes('/estimate-fee')) return ok(buildGasFee());
    if (pathname.includes('/invite-code/query')) return ok({ code: '' });
    if (pathname.includes('/invite-code/check')) return ok({ valid: true });
    return ok({ success: true });
  }

  if (
    pathname.startsWith('/notification/v1/') ||
    pathname.startsWith('/rebate/v1/') ||
    pathname.startsWith('/prime/v1/')
  ) {
    if (pathname === '/notification/v1/message/badges') return ok({ unread: 0 });
    if (pathname === '/notification/v1/message/list') return ok(buildEmptyPage());
    if (pathname === '/notification/v1/config/supported-networks') return ok([]);
    if (pathname === '/notification/v1/config/query') return ok({});
    if (pathname === '/prime/v1/general/get-random-id') {
      return ok({ randomId: `unionkey-${Date.now()}` });
    }
    if (pathname === '/prime/v1/user/info') {
      return ok({ user: null, subscription: null, isLoggedIn: false });
    }
    if (pathname === '/prime/v1/user/devices') return ok([]);
    if (/^\/prime\/v1\/user\/device\//.test(pathname)) {
      return ok({ success: true });
    }
    if (pathname === '/prime/v1/sync/check') return ok({ needSync: false });
    if (pathname === '/prime/v1/sync/download') return ok({ data: null });
    if (pathname === '/prime/v1/sync/lock') return ok({ locked: false });
    if (pathname === '/rebate/v1/invite/summary') {
      return ok({
        inviteCode: '',
        totalRewards: '0',
        totalInvites: 0,
      });
    }
    if (pathname === '/rebate/v1/invite/post-config') return ok({});
    if (pathname === '/rebate/v1/wallet/check') return ok({ bound: false });
    if (pathname === '/rebate/v1/wallet/message') return ok({ message: '' });
    if (pathname.includes('/list')) return ok(buildEmptyPage());
    if (pathname.includes('/history') || pathname.includes('/records')) {
      return ok(buildEmptyPage());
    }
    if (pathname.includes('/query')) return ok({});
    return ok({ success: true });
  }

  return {
    code: 501,
    message: `UnionKey API route not implemented: ${req.method} ${pathname}`,
    data: null,
  };
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type,Authorization,X-Unionkey-Request-Token,X-UnionKey-Dev-Proxy',
      'Cache-Control': 'no-store',
    });
    res.end();
    return;
  }

  const url = new URL(
    req.url || '/',
    `http://${req.headers.host || 'localhost'}`,
  );

  if (req.method === 'GET' && url.pathname === '/swap/v1/quote/events') {
    console.log(`[UnionKey API] ${req.method} ${url.pathname}`);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write('event: done\n');
    res.write('data: {}\n\n');
    res.end();
    return;
  }

  const requestBody = ['POST', 'PUT', 'PATCH'].includes(req.method || '')
    ? await readJsonBody(req)
    : {};
  console.log(`[UnionKey API] ${req.method} ${url.pathname}`);
  const body = await route(req, url, requestBody);
  if (body.code === 501) {
    console.warn(body.message);
  }
  sendJson(res, body.code === 501 ? 501 : 200, body);
});

server.listen(port, host, () => {
  console.log(`UnionKey API listening on http://${host}:${port}`);
});
