"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasSetTagWithBody = void 0;
const CardanoWasm = __importStar(require("@emurgo/cardano-serialization-lib-asmjs"));
const hasSetTagWithBody = (txBodyHex) => {
    const txBody = CardanoWasm.TransactionBody.from_bytes(Uint8Array.from(Buffer.from(txBodyHex, 'hex')));
    const witnesses = CardanoWasm.TransactionWitnessSet.new();
    const tx = CardanoWasm.Transaction.new(txBody, witnesses);
    let tagCborSets = false;
    try {
        const tagCBOR = CardanoWasm.has_transaction_set_tag(tx.to_bytes()).valueOf();
        tagCborSets =
            tagCBOR === CardanoWasm.TransactionSetsState.AllSetsHaveTag.valueOf() ||
                tagCBOR === CardanoWasm.TransactionSetsState.MixedSets.valueOf();
    }
    catch (error) {
        // ignore
    }
    return Promise.resolve(tagCborSets);
};
exports.hasSetTagWithBody = hasSetTagWithBody;
