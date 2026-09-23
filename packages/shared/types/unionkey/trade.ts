export type IUnionKeyAssistSiteId =
  | 'hyperliquid'
  | 'oneInch'
  | 'nearIntents'
  | 'velora';

export type IUnionKeyAssistAuthorizationMode = 'confirmEach' | 'delegated';
export type IUnionKeyTradeEnvironment = 'testnet' | 'mainnet';
export type IUnionKeyTradeInstrument = 'spot' | 'perp';

export type IUnionKeyAssistTaskStatus =
  | 'draft'
  | 'authorizing'
  | 'monitoring'
  | 'ready'
  | 'awaitingSignature'
  | 'submitting'
  | 'completed'
  | 'cancelled'
  | 'error';

export type IUnionKeyAssistTrigger =
  | {
      type: 'immediate';
    }
  | {
      type: 'price';
      operator: 'gte' | 'lte';
      value: string;
    }
  | {
      type: 'signal';
      side: 'buy' | 'sell';
    };

export type IUnionKeyAssistMarketSignal = {
  shortAverage: string;
  longAverage: string;
  momentumPercent: string;
};

export type IUnionKeyAssistMarketAnalysis = {
  scope: 'asset' | 'market';
  baseSymbol?: string;
  currentPrice?: string;
  signal?: IUnionKeyAssistMarketSignal;
  markets?: Array<{
    symbol: string;
    currentPrice: string;
    momentumPercent?: string;
    direction: 'bullish' | 'bearish' | 'neutral';
  }>;
  updatedAt: number;
};

export type IUnionKeyAssistOrderPlan = {
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  /** Prevent a close/reduce-position intent from opening a reverse position. */
  reduceOnly?: boolean;
  amount: string;
  amountUnit: 'base' | 'quote';
  limitPrice?: string;
  maxSlippagePercent: string;
  leverage?: number;
  marginMode: 'cross' | 'isolated';
  takeProfitPercent?: string;
  stopLossPercent?: string;
};

export type IUnionKeyAssistRiskPolicy = {
  allowedSymbols: string[];
  maxOrderNotional: string;
  maxDailyNotional: string;
  maxLeverage: number;
  maxSlippagePercent: string;
  requireStopLoss: boolean;
  expiresAt: number;
};

export type IUnionKeyAssistRiskCheck = {
  id:
    | 'symbol'
    | 'orderNotional'
    | 'dailyNotional'
    | 'leverage'
    | 'slippage'
    | 'stopLoss'
    | 'expiry';
  status: 'passed' | 'warning' | 'blocked';
  label: string;
  detail: string;
};

export type IUnionKeyAssistRiskAssessment = {
  passed: boolean;
  estimatedNotional: string;
  estimatedMaxLoss?: string;
  dailyNotionalAfterOrder: string;
  checks: IUnionKeyAssistRiskCheck[];
};

export type IUnionKeyHyperliquidOrderWire = {
  a: number;
  b: boolean;
  p: string;
  s: string;
  r: boolean;
  /** Stable client order id used to make retries idempotent. */
  c?: string;
  t:
    | {
        limit: {
          tif: 'Ioc' | 'Gtc';
        };
      }
    | {
        trigger: {
          isMarket: boolean;
          triggerPx: string;
          tpsl: 'tp' | 'sl';
        };
      };
};

export type IUnionKeyHyperliquidOrderAction = {
  type: 'order';
  orders: IUnionKeyHyperliquidOrderWire[];
  grouping: 'na' | 'normalTpsl';
};

export type IUnionKeyHyperliquidUpdateLeverageAction = {
  type: 'updateLeverage';
  asset: number;
  isCross: boolean;
  leverage: number;
};

export type IUnionKeyHyperliquidCancelAction = {
  type: 'cancel';
  cancels: Array<{
    a: number;
    o: number;
  }>;
};

export type IUnionKeyHyperliquidTradingAction =
  | IUnionKeyHyperliquidOrderAction
  | IUnionKeyHyperliquidUpdateLeverageAction
  | IUnionKeyHyperliquidCancelAction;

export type IUnionKeyAssistTypedData = {
  domain: {
    chainId: number;
    name: string;
    verifyingContract: string;
    version: string;
  };
  types: {
    EIP712Domain: Array<{
      name: string;
      type: string;
    }>;
    Agent: Array<{
      name: string;
      type: string;
    }>;
  };
  primaryType: 'Agent';
  message: {
    source: 'a' | 'b';
    connectionId: string;
  };
};

export type IUnionKeyHyperliquidApproveAgentAction = {
  type: 'approveAgent';
  signatureChainId: '0xa4b1';
  hyperliquidChain: 'Mainnet' | 'Testnet';
  agentAddress: string;
  agentName: string;
  nonce: number;
};

export type IUnionKeyAgentApprovalTypedData = {
  domain: {
    chainId: number;
    name: 'HyperliquidSignTransaction';
    verifyingContract: string;
    version: '1';
  };
  types: {
    EIP712Domain: Array<{
      name: string;
      type: string;
    }>;
    'HyperliquidTransaction:ApproveAgent': Array<{
      name: string;
      type: string;
    }>;
  };
  primaryType: 'HyperliquidTransaction:ApproveAgent';
  message: {
    hyperliquidChain: 'Mainnet' | 'Testnet';
    agentAddress: string;
    agentName: string;
    nonce: number;
  };
};

export type IUnionKeyAgentApproval = {
  id: string;
  operation: 'authorize' | 'revoke';
  accountAddress: string;
  agentAddress: string;
  agentName: string;
  nonce: number;
  expiresAt: number;
  action: IUnionKeyHyperliquidApproveAgentAction;
  typedData: IUnionKeyAgentApprovalTypedData;
};

export type IUnionKeyAssistAgentGrant = {
  accountAddress: string;
  agentAddress: string;
  agentName: string;
  status: 'active' | 'revoked' | 'expired';
  riskPolicy: IUnionKeyAssistRiskPolicy;
  createdAt: number;
  updatedAt: number;
  lastVerifiedAt?: number;
};

export type IUnionKeyAssistPreparedAction = {
  kind: 'leverage' | 'order' | 'cancel';
  action: IUnionKeyHyperliquidTradingAction;
  nonce: number;
  expiresAfter: number;
  typedData: IUnionKeyAssistTypedData;
};

export type IUnionKeyAssistExecutionPreview = {
  markPrice: string;
  oraclePrice?: string;
  estimatedFillPrice: string;
  availableToTrade?: string;
  accountValue?: string;
  marginUsed?: string;
  estimatedInitialMargin?: string;
  currentLiquidationPrice?: string;
  estimatedTradingFee?: string;
  feeRate?: string;
  currentFundingRate?: string;
  unionKeyFee: '0';
};

export type IUnionKeyAssistPreparedOrder = {
  provider: 'hyperliquid';
  actions: IUnionKeyAssistPreparedAction[];
  accountAddress: string;
  typedData: IUnionKeyAssistTypedData;
  currentPrice: string;
  size: string;
  limitPrice: string;
  estimatedNotional: string;
  environment: IUnionKeyTradeEnvironment;
  clientOrderIds: string[];
  preview: IUnionKeyAssistExecutionPreview;
  takeProfitPrice?: string;
  stopLossPrice?: string;
  preparedAt: number;
};

export type IUnionKeyAssistExecutionResult = {
  status: 'filled' | 'resting' | 'accepted' | 'cancelled' | 'rejected';
  orderId?: string;
  orderIds?: string[];
  signedBy: 'hardware' | 'agent';
  submittedAt: number;
  exchangeStatus?: string;
  lastReconciledAt?: number;
};

export type IUnionKeyAssistExecutionReceipt = {
  id: string;
  taskId: string;
  accountAddress: string;
  environment: IUnionKeyTradeEnvironment;
  instrument: IUnionKeyTradeInstrument;
  provider: 'hyperliquid';
  baseSymbol: string;
  quoteSymbol: string;
  side: 'buy' | 'sell';
  size: string;
  estimatedNotional: string;
  clientOrderIds: string[];
  result: IUnionKeyAssistExecutionResult;
  createdAt: number;
};

export type IUnionKeyAssistTask = {
  id: string;
  siteId: IUnionKeyAssistSiteId;
  accountAddress: string;
  authorizationMode: IUnionKeyAssistAuthorizationMode;
  environment: IUnionKeyTradeEnvironment;
  instrument: IUnionKeyTradeInstrument;
  requirement: string;
  baseSymbol: string;
  quoteSymbol: string;
  trigger: IUnionKeyAssistTrigger;
  orderPlan: IUnionKeyAssistOrderPlan;
  riskPolicy: IUnionKeyAssistRiskPolicy;
  riskAssessment: IUnionKeyAssistRiskAssessment;
  status: IUnionKeyAssistTaskStatus;
  currentPrice?: string;
  signal?: IUnionKeyAssistMarketSignal;
  preparedOrder?: IUnionKeyAssistPreparedOrder;
  executionResult?: IUnionKeyAssistExecutionResult;
  createdAt: number;
  updatedAt: number;
  lastCheckedAt?: number;
  error?: string;
  notifiedAt?: number;
};

export type ICreateUnionKeyAssistTaskParams = {
  siteId: IUnionKeyAssistSiteId;
  accountAddress: string;
  authorizationMode: IUnionKeyAssistAuthorizationMode;
  requirement: string;
  paymentSymbol?: string;
  riskPolicy: IUnionKeyAssistRiskPolicy;
};

export type IActivateUnionKeyAssistTaskParams = {
  taskId: string;
};

export type IPrepareUnionKeyAssistExecutionParams = {
  taskId: string;
  accountAddress: string;
};

export type ISubmitUnionKeyAssistExecutionParams = {
  taskId: string;
  accountAddress: string;
  signatures: string[];
};

export type IPrepareUnionKeyAssistOrderCancellationParams = {
  taskId: string;
  accountAddress: string;
};

export type ISubmitUnionKeyAssistOrderCancellationParams = {
  taskId: string;
  accountAddress: string;
  signature: string;
};

export type ISubmitUnionKeyAgentApprovalParams = {
  taskId: string;
  approvalId: string;
  signature: string;
};

export type IPrepareUnionKeyAgentRevocationParams = {
  accountAddress: string;
};

export type ISubmitUnionKeyAgentRevocationParams = {
  accountAddress: string;
  approvalId: string;
  signature: string;
};

export type IUnionKeyAssistRequirement = Pick<
  IUnionKeyAssistTask,
  'baseSymbol' | 'quoteSymbol' | 'trigger' | 'orderPlan'
>;
