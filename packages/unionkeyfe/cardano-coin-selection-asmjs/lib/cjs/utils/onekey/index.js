"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dAppUtils = exports.onekeyUtils = void 0;
const transaction_1 = require("./transaction");
const signTx_1 = require("./signTx");
const dapp_1 = require("./dapp");
Object.defineProperty(exports, "dAppUtils", { enumerable: true, get: function () { return dapp_1.dAppUtils; } });
const txToOneKey_1 = require("./txToOneKey");
const hasSetTag_1 = require("./hasSetTag");
const onekeyUtils = {
    composeTxPlan: transaction_1.composeTxPlan,
    signTransaction: signTx_1.signTransaction,
    signTx: signTx_1.signTx,
    txToOneKey: txToOneKey_1.txToOneKey,
    hasSetTagWithBody: hasSetTag_1.hasSetTagWithBody,
};
exports.onekeyUtils = onekeyUtils;
