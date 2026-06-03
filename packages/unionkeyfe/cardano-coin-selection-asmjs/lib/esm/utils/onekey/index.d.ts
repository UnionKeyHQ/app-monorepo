import { dAppUtils } from './dapp';
declare const onekeyUtils: {
    composeTxPlan: (transferInfo: import("./types").ITransferInfo, accountXpub: string, utxos: import("./types").IAdaUTXO[], changeAddress: string, outputs: import("./types").IOutput[], options?: {
        debug: boolean;
    }) => Promise<import("../../types/types").PrecomposedTransaction>;
    signTransaction: (txBodyHex: string, address: string, accountIndex: number, utxos: import("./types").IAdaUTXO[], xprv: string, signOnly: boolean, partialSign?: boolean) => Promise<{
        signedTx: string;
        txid: string;
    }>;
    signTx: (keys: {
        accountKey: import("@emurgo/cardano-serialization-lib-asmjs").Bip32PrivateKey;
        paymentKey: import("@emurgo/cardano-serialization-lib-asmjs").PrivateKey;
        stakeKey: import("@emurgo/cardano-serialization-lib-asmjs").PrivateKey;
    }, tx: string, keyHashes: string[], partialSign?: boolean) => Promise<import("@emurgo/cardano-serialization-lib-asmjs").TransactionWitnessSet>;
    txToOneKey: (rawTx: string, network: number, initKeys: {
        payment: {
            hash: string | null;
            path: string | null;
        };
        stake: {
            hash: string | null;
            path: string | null;
        };
    }, xpub: string, changeAddress: import("./types").IChangeAddress) => Promise<{
        signingMode: import("./txToOneKey").CardanoTxSigningMode.ORDINARY_TRANSACTION | import("./txToOneKey").CardanoTxSigningMode.POOL_REGISTRATION_AS_OWNER | import("./txToOneKey").CardanoTxSigningMode.PLUTUS_TRANSACTION;
        outputs: never[];
        fee: string;
        ttl: string | null;
        validityIntervalStart: any;
        certificates: [] | null;
        withdrawals: null;
        auxiliaryData: {
            hash: string;
        } | null;
        mint: null;
        scriptDataHash: string | null;
        collateralInputs: null;
        requiredSigners: null;
        protocolMagic: number;
        networkId: number;
        includeNetworkId: boolean;
        additionalWitnessRequests: null;
        collateralReturn: null;
        totalCollateral: string | null;
        referenceInputs: null;
        tagCborSets: boolean;
    }>;
    hasSetTagWithBody: (txBodyHex: string) => Promise<boolean>;
};
export { onekeyUtils, dAppUtils };
